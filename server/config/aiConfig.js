import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // AI Settings
  aiProvider: process.env.AI_PROVIDER || 'gemini', // 'gemini' | 'openrouter' | 'ollama'
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  aiModel: process.env.AI_MODEL || 'gemini-3.1-flash-lite', // Default Gemini model

  // Embedding Settings
  embeddingProvider: process.env.EMBEDDING_PROVIDER || 'gemini', // 'gemini' | 'openai' | 'ollama'
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  embeddingModel: process.env.EMBEDDING_MODEL || 'gemini-embedding-001', // Gemini: gemini-embedding-001, OpenAI: text-embedding-3-small

  // Vector DB Settings
  vectorDb: process.env.VECTOR_DB || 'qdrant', // 'qdrant'
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || '',
  qdrantCollection: process.env.QDRANT_COLLECTION || 'agency_knowledge_base',

  // RAG Parameters
  chunkSize: parseInt(process.env.CHUNK_SIZE, 10) || 800,
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP, 10) || 150,
  topK: parseInt(process.env.TOP_K, 10) || 5,
  similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.5,
  maxContextSize: parseInt(process.env.MAX_CONTEXT_SIZE, 10) || 12000,
  streaming: process.env.STREAMING === 'true' || process.env.STREAMING === undefined,

  // File Upload Limits
  uploadLimitMb: parseInt(process.env.UPLOAD_LIMIT_MB, 10) || 10,
  allowedMimes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'text/plain',
    'text/markdown',
    'text/x-markdown'
  ]
};

export default config;
