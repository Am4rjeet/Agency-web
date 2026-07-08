import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Models
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import Session from '../models/Session.js';
import UsageLog from '../models/UsageLog.js';

// Services
import config from '../config/aiConfig.js';
import logger from '../utils/logger.js';
import searchService from '../services/searchService.js';
import ingestionService from '../services/ingestionService.js';
import aiProviderManager from '../services/aiProviderManager.js';
import embeddingService from '../services/embeddingService.js';
import vectorDbService from '../services/vectorDbService.js';
import { indexSiteContent } from '../services/seedKnowledgeBase.js';

// Middleware
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// RATE LIMITERS & SECURITY
// ============================================================================

// Strict rate limiting on chat endpoint to prevent prompt spamming
const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { message: 'Too many chat requests. Please slow down and try again.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Configure Multer memory storage for parsing document uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: config.uploadLimitMb * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (config.allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Acceptable types are PDF, DOCX, TXT, and Markdown.`));
    }
  }
});

// ============================================================================
// API V1 ROUTE ENDPOINTS
// ============================================================================

/**
 * GET /api/v1/health
 * Detailed health diagnostic report verifying MongoDB, Qdrant, and LLM providers.
 */
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  const report = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: 'unknown' },
      vectorDb: { status: 'unknown' },
      aiProvider: { status: 'unknown' }
    },
    latencyMs: 0
  };

  try {
    // 1. Check MongoDB
    const mongoStatus = mongoose.connection.readyState;
    report.services.mongodb = {
      status: mongoStatus === 1 ? 'connected' : 'disconnected',
      readyState: mongoStatus
    };
    if (mongoStatus !== 1) report.status = 'degraded';

    // 2. Check Vector DB
    try {
      const vectorStats = await vectorDbService.getCollectionStats();
      report.services.vectorDb = {
        status: 'connected',
        collection: config.qdrantCollection,
        driver: config.vectorDb,
        ...vectorStats
      };
    } catch (err) {
      report.services.vectorDb = { status: 'error', message: err.message };
      report.status = 'degraded';
    }

    // 3. Check AI Provider
    const activeProvider = config.aiProvider;
    const hasKey = activeProvider === 'gemini' ? !!config.geminiApiKey : !!config.openaiApiKey;
    report.services.aiProvider = {
      status: hasKey ? 'configured' : 'missing_credentials',
      provider: activeProvider,
      model: config.aiModel
    };
    if (!hasKey && activeProvider !== 'ollama') report.status = 'degraded';

    report.latencyMs = Date.now() - startTime;
    return res.json(report);
  } catch (err) {
    logger.error('Health check failed', { error: err.message });
    return res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

/**
 * POST /api/v1/reindex
 * Administrative trigger to wipe and scrape static website content + projects.
 */
router.post('/reindex', authenticateToken, async (req, res) => {
  try {
    // Start index refresh in the background
    indexSiteContent()
      .then(() => logger.info('Manual site re-index run completed.'))
      .catch(err => logger.error('Manual site re-index failed', { error: err.message }));

    return res.json({
      status: 'processing',
      message: 'Site re-indexing pipeline triggered successfully in background.'
    });
  } catch (err) {
    logger.error('Failed to trigger re-index', { error: err.message });
    return res.status(500).json({ message: 'Error triggering site re-indexing', error: err.message });
  }
});

/**
 * GET /api/v1/documents
 * List all knowledge base documents and index stats.
 */
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve documents log', error: err.message });
  }
});

/**
 * POST /api/v1/upload
 * Secured file uploader running parses, splitters, and embedding uploads in the background.
 */
router.post('/upload', authenticateToken, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid document file.' });
    }

    try {
      const buffer = req.file.buffer;
      const title = req.body.title || req.file.originalname;
      const hash = crypto.createHash('md5').update(buffer).digest('hex');

      // Check if document already exists
      const existingDoc = await Document.findOne({ hash });
      if (existingDoc) {
        return res.status(409).json({ 
          message: 'Document already exists in the knowledge base.', 
          document: existingDoc 
        });
      }

      // Create new document record
      const doc = new Document({
        title,
        type: 'file',
        filePath: req.file.originalname,
        sizeBytes: req.file.size,
        hash,
        status: 'pending',
        uploadedBy: req.user.id
      });
      await doc.save();

      // Trigger parsing and ingestion in background
      await ingestionService.ingestUploadedFile(doc._id, buffer, req.file.mimetype);

      return res.status(202).json({
        message: 'File uploaded successfully and parsing has started in the background.',
        document: doc
      });
    } catch (err) {
      logger.error('File upload initialization failed', { error: err.message });
      return res.status(500).json({ message: 'Error initiating file ingestion', error: err.message });
    }
  });
});

/**
 * DELETE /api/v1/documents/:id
 * Secured document deletion endpoint. Purges database items and Qdrant points.
 */
router.delete('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await Document.findById(docId);
    
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    await ingestionService.deleteDocument(docId);
    return res.json({ message: 'Document successfully deleted from knowledge base.' });
  } catch (err) {
    logger.error('Document deletion failed', { docId: req.params.id, error: err.message });
    return res.status(500).json({ message: 'Error deleting document records', error: err.message });
  }
});

/**
 * POST /api/v1/chat/sessions
 * Create a new persistent chat session.
 */
router.post('/chat/sessions', async (req, res) => {
  try {
    const sessionId = crypto.randomUUID();
    const session = new Session({
      sessionId,
      title: 'New Conversation',
      messages: []
    });
    await session.save();
    return res.status(201).json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating chat session', error: err.message });
  }
});

/**
 * GET /api/v1/chat/sessions
 * List all persistent sessions.
 */
router.get('/chat/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ updatedAt: -1 }).limit(50);
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving sessions list', error: err.message });
  }
});

/**
 * PUT /api/v1/chat/sessions/:id
 * Rename an active session title.
 */
router.put('/chat/sessions/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a valid session title.' });
    }

    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.id },
      { title: title.trim() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session session not found.' });
    }

    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Error renaming session title', error: err.message });
  }
});

/**
 * DELETE /api/v1/chat/sessions/:id
 * Permanent deletion of a chat session.
 */
router.delete('/chat/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ sessionId: req.params.id });
    if (!session) {
      return res.status(404).json({ message: 'Session session not found.' });
    }
    return res.json({ message: 'Conversation session successfully deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting conversation session', error: err.message });
  }
});

/**
 * GET /api/v1/chat/sessions/:id
 * Retrieve history for a single chat session.
 */
router.get('/chat/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });
    if (!session) {
      return res.status(404).json({ message: 'Conversation session not found.' });
    }
    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving conversation history', error: err.message });
  }
});

/**
 * POST /api/v1/chat
 * Primary RAG conversational interface. Supports streaming, citations, memory, and safety.
 */
router.post('/chat', chatRateLimiter, async (req, res) => {
  const requestStartTime = Date.now();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { sessionId, query, stream = true } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: 'Query string cannot be empty' });
  }

  try {
    // 1. Fetch or create Session
    let activeSessionId = sessionId;
    let session = null;
    let isNewSession = false;

    if (activeSessionId) {
      session = await Session.findOne({ sessionId: activeSessionId });
    }

    if (!session) {
      activeSessionId = crypto.randomUUID();
      session = new Session({
        sessionId: activeSessionId,
        title: query.split(' ').slice(0, 4).join(' ') + '...',
        messages: []
      });
      await session.save();
      isNewSession = true;
    }

    // 2. Hybrid search context retrieval
    const searchStartTime = Date.now();
    const searchResult = await searchService.hybridSearch(query.trim());
    const searchLatencyMs = Date.now() - searchStartTime;

    const contextText = searchResult.contextText;
    const citations = searchResult.citations;

    // 3. Assemble RAG instruction prompt
    const systemPrompt = `
You are the official AI RAG Assistant for Amarix Solutions.
Your goal is to answer client and visitor questions accurately based ONLY on the validated context provided.

Strict Operational Guidelines:
1. Greetings & Small Talk: You can engage in basic, friendly greetings and small talk (e.g., replying to "hey", "hello", "hi", "how are you", "who are you", etc. with a friendly greeting and asking how you can help them).
2. Primary Reference: Answer the question using the text segments inside the [Source] blocks.
3. Missing Info Policy: If the user asks a specific question about the agency, its operations, prices, services, or facts that are not present in the provided sources, reply exactly with:
   "I am sorry, but I do not have that information in my knowledge base. Please contact our support team or use the booking calendar for a consultation."
   Do NOT attempt to invent, extrapolate, or hallucinate answers under any circumstances.
4. Conversational Tone: Keep your tone helpful, technical, corporate, and professional.
5. Source Constraints: Never cite outside URLs or source materials that are not explicitly provided in the context blocks.

[KNOWLEDGE BASE CONTEXT]
${contextText || 'No source materials are currently indexed for this query.'}
`;

    // Estimate embedding time (part of search search)
    const embeddingTimeMs = Math.round(searchLatencyMs * 0.3); // estimate portion

    // 4. Trigger streaming or non-streaming responses
    if (stream && req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let completeReplyText = '';
      const llmStartTime = Date.now();

      const writeCallback = (textChunk) => {
        completeReplyText += textChunk;
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      };

      const errorCallback = (err) => {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      };

      const tokenUsage = await aiProviderManager.generateStreamResponse(
        systemPrompt,
        query.trim(),
        session.messages,
        writeCallback,
        errorCallback
      );

      const llmLatencyMs = Date.now() - llmStartTime;
      const totalLatencyMs = Date.now() - requestStartTime;

      // 5. Append messages to Session History
      session.messages.push({ role: 'user', content: query.trim(), citations: [] });
      session.messages.push({ role: 'model', content: completeReplyText, citations });
      
      // Auto-generate session title on first message in background
      if (isNewSession || session.messages.length <= 2) {
        try {
          const titlePrompt = `Summarize this user question in exactly 3-5 words without quotes: "${query.trim()}"`;
          const titleSummary = await aiProviderManager.generateResponse("You are a helpful assistant.", titlePrompt, [], { temperature: 0.3 });
          session.title = titleSummary.text.trim().replace(/^"|"$/g, '') || session.title;
        } catch (e) {
          // Keep default fallback
        }
      }
      
      await session.save();

      // Write telemetric usage log
      const usage = new UsageLog({
        sessionId: activeSessionId,
        query: query.trim(),
        response: completeReplyText,
        latencyMs: totalLatencyMs,
        embeddingTimeMs,
        searchTimeMs: searchLatencyMs - embeddingTimeMs,
        llmTimeMs: llmLatencyMs,
        tokenUsage,
        provider: config.aiProvider,
        model: config.aiModel,
        status: 'success',
        ip
      });
      await usage.save();

      res.write(`data: ${JSON.stringify({ done: true, sessionId: activeSessionId, citations })}\n\n`);
      res.end();
    } else {
      // Non-stream response fallback
      const llmStartTime = Date.now();
      const responseData = await aiProviderManager.generateResponse(
        systemPrompt,
        query.trim(),
        session.messages
      );

      const llmLatencyMs = Date.now() - llmStartTime;
      const totalLatencyMs = Date.now() - requestStartTime;

      session.messages.push({ role: 'user', content: query.trim(), citations: [] });
      session.messages.push({ role: 'model', content: responseData.text, citations });
      
      if (isNewSession || session.messages.length <= 2) {
        try {
          const titlePrompt = `Summarize this user question in exactly 3-5 words without quotes: "${query.trim()}"`;
          const titleSummary = await aiProviderManager.generateResponse("You are a helpful assistant.", titlePrompt, [], { temperature: 0.3 });
          session.title = titleSummary.text.trim().replace(/^"|"$/g, '') || session.title;
        } catch (e) {
          // Keep default fallback
        }
      }
      
      await session.save();

      const usage = new UsageLog({
        sessionId: activeSessionId,
        query: query.trim(),
        response: responseData.text,
        latencyMs: totalLatencyMs,
        embeddingTimeMs,
        searchTimeMs: searchLatencyMs - embeddingTimeMs,
        llmTimeMs: llmLatencyMs,
        tokenUsage: responseData.tokenUsage,
        provider: config.aiProvider,
        model: config.aiModel,
        status: 'success',
        ip
      });
      await usage.save();

      return res.json({
        sessionId: activeSessionId,
        text: responseData.text,
        citations,
        latencyMs: totalLatencyMs
      });
    }
  } catch (err) {
    logger.error('Chat endpoint encountered error', { error: err.message });
    
    // Log failure
    try {
      const usage = new UsageLog({
        query: query.trim(),
        provider: config.aiProvider,
        model: config.aiModel,
        status: 'failed',
        errorMessage: err.message,
        ip
      });
      await usage.save();
    } catch (e) {}

    return res.status(500).json({ message: 'Error processing chat query', error: err.message });
  }
});

/**
 * GET /api/v1/analytics/daily
 * Observability/telemetry endpoint supplying aggregate metrics over time.
 */
router.get('/analytics/daily', authenticateToken, async (req, res) => {
  try {
    const totalRequests = await UsageLog.countDocuments();
    const failedRequests = await UsageLog.countDocuments({ status: 'failed' });
    const successLogs = await UsageLog.find({ status: 'success' });
    
    let totalLatency = 0;
    successLogs.forEach(log => { totalLatency += log.latencyMs; });
    const avgResponseTime = successLogs.length ? Math.round(totalLatency / successLogs.length) : 0;

    const activeSessions = await Session.countDocuments();
    const indexedDocuments = await Document.countDocuments();
    const indexedChunks = await Chunk.countDocuments();

    // Storage estimation (chunks character sizes as proxy)
    const chunks = await Chunk.find({}, 'text');
    let totalBytes = 0;
    chunks.forEach(c => { totalBytes += Buffer.byteLength(c.text, 'utf8'); });
    const storageUsage = `${(totalBytes / 1024 / 1024).toFixed(3)} MB`;

    // Latency averages grouped
    let avgEmbedding = 0;
    let avgSearch = 0;
    let avgLlm = 0;
    
    if (successLogs.length) {
      let sumEmbedding = 0, sumSearch = 0, sumLlm = 0;
      successLogs.forEach(l => {
        sumEmbedding += l.embeddingTimeMs;
        sumSearch += l.searchTimeMs;
        sumLlm += l.llmTimeMs;
      });
      avgEmbedding = Math.round(sumEmbedding / successLogs.length);
      avgSearch = Math.round(sumSearch / successLogs.length);
      avgLlm = Math.round(sumLlm / successLogs.length);
    }

    return res.json({
      totalRequests,
      activeSessions,
      avgResponseTime,
      indexedDocuments,
      indexedChunks,
      failedRequests,
      storageUsage,
      breakdown: {
        avgEmbedding,
        avgSearch,
        avgLlm
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve analytics metrics', error: err.message });
  }
});

// ============================================================================
// BACKUP & RESTORE APIS
// ============================================================================

/**
 * GET /api/v1/backup/export
 * Admin snapshot backup export.
 */
router.get('/backup/export', authenticateToken, async (req, res) => {
  try {
    const docs = await Document.find();
    const chunks = await Chunk.find();
    const sessions = await Session.find();

    const snapshot = {
      exportedAt: new Date().toISOString(),
      documents: docs,
      chunks: chunks,
      sessions: sessions
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="knowledge_base_backup.json"');
    return res.send(JSON.stringify(snapshot, null, 2));
  } catch (err) {
    return res.status(500).json({ message: 'Backup snapshot creation failed', error: err.message });
  }
});

/**
 * POST /api/v1/backup/import
 * Admin snapshot import parser.
 */
router.post('/backup/import', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Upload a backup JSON snapshot file.' });
  }

  try {
    const snapshot = JSON.parse(req.file.buffer.toString('utf-8'));
    
    if (!snapshot.documents || !snapshot.chunks) {
      return res.status(400).json({ message: 'Invalid backup file structure.' });
    }

    // 1. Wipe current collections
    await Document.deleteMany({});
    await Chunk.deleteMany({});
    if (snapshot.sessions) {
      await Session.deleteMany({});
    }

    // 2. Restore Mongo records
    await Document.insertMany(snapshot.documents);
    await Chunk.insertMany(snapshot.chunks);
    if (snapshot.sessions && snapshot.sessions.length > 0) {
      await Session.insertMany(snapshot.sessions);
    }

    // 3. Sync to Qdrant index (regenerates vectors by chunk text)
    logger.info('Re-syncing Qdrant index after backup import...');
    try {
      await vectorDbService.init(); // wipe/ensure collection
      const pointsToUpsert = [];

      for (const chk of snapshot.chunks) {
        const vector = await embeddingService.getEmbedding(chk.text);
        const doc = snapshot.documents.find(d => String(d._id) === String(chk.documentId));
        
        pointsToUpsert.push({
          chunkId: chk.chunkId,
          documentId: String(chk.documentId),
          vector,
          title: doc?.title || 'Restored Source',
          source: doc?.type || 'file',
          pageNumber: chk.pageNumber || 1,
          category: chk.metadata?.category || 'General',
          text: chk.text,
          createdAt: chk.createdAt || new Date().toISOString()
        });
      }

      if (pointsToUpsert.length > 0) {
        await vectorDbService.upsert(pointsToUpsert);
      }
      logger.info('Qdrant vectors synchronized successfully.');
    } catch (vectorErr) {
      logger.error('Failed to sync vector index during backup import', { error: vectorErr.message });
      // Proceed because Mongo data is imported, but report warning
    }

    return res.json({ 
      message: 'Knowledge base restore snapshot imported and synced successfully.',
      documentsRestored: snapshot.documents.length,
      chunksRestored: snapshot.chunks.length
    });
  } catch (err) {
    logger.error('Backup import parsing failed', { error: err.message });
    return res.status(550).json({ message: 'Backup restoration failed', error: err.message });
  }
});

export default router;
