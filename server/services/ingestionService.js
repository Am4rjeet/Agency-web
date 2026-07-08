import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import documentParser from './documentParser.js';
import { textSplitter } from './textSplitter.js';
import embeddingService from './embeddingService.js';
import vectorDbService from './vectorDbService.js';
import logger from '../utils/logger.js';

class IngestionService {
  /**
   * Ingest an uploaded file in the background.
   * @param {string} docId MongoDB Document ID
   * @param {Buffer} buffer File buffer
   * @param {string} mimeType MIME type of the file
   */
  async ingestUploadedFile(docId, buffer, mimeType) {
    // Non-blocking trigger
    this._processFileIngestion(docId, buffer, mimeType)
      .then(() => logger.info(`Document ingestion succeeded for ID: ${docId}`))
      .catch(err => {
        logger.error(`Document ingestion failed for ID: ${docId}`, { error: err.message });
      });

    return { status: 'processing', message: 'Ingestion pipeline launched in background' };
  }

  /**
   * Ingest raw text directly (used for portfolio projects, FAQs, blogs, services, etc.)
   * @param {string} docId MongoDB Document ID
   * @param {string} text Raw text content
   * @param {object} baseMetadata Common metadata for the chunks
   */
  async ingestTextContent(docId, text, baseMetadata = {}) {
    this._processTextIngestion(docId, text, baseMetadata)
      .then(() => logger.info(`Text content ingestion succeeded for ID: ${docId}`))
      .catch(err => {
        logger.error(`Text content ingestion failed for ID: ${docId}`, { error: err.message });
      });

    return { status: 'processing', message: 'Text ingestion pipeline launched in background' };
  }

  /**
   * Delete a document, its MongoDB chunks, and Qdrant vectors.
   * @param {string} docId MongoDB Document ID
   */
  async deleteDocument(docId) {
    logger.info(`Starting deletion pipeline for Document: ${docId}`);
    try {
      // 1. Delete vectors from Qdrant
      await vectorDbService.deleteByDocumentId(docId);
      logger.debug(`Deleted vector points for Document: ${docId}`);

      // 2. Delete chunks from MongoDB
      await Chunk.deleteMany({ documentId: docId });
      logger.debug(`Deleted chunks from MongoDB for Document: ${docId}`);

      // 3. Delete Document record from MongoDB
      await Document.findByIdAndDelete(docId);
      logger.info(`Successfully deleted Document ${docId} from knowledge base.`);
      
      return true;
    } catch (err) {
      logger.error(`Failed to delete Document ${docId}`, { error: err.message });
      throw err;
    }
  }

  /* ==========================================================================
     PRIVATE BACKGROUND PROCESSORS
     ========================================================================== */

  async _processFileIngestion(docId, buffer, mimeType) {
    const doc = await Document.findById(docId);
    if (!doc) {
      throw new Error(`Document record not found: ${docId}`);
    }

    try {
      // Update status to processing
      doc.status = 'processing';
      await doc.save();

      // 1. Extract text
      const rawText = await documentParser.parseBuffer(buffer, mimeType);
      
      // 2. Clear out any pre-existing chunks/vectors for this document (e.g. if re-indexing)
      await vectorDbService.deleteByDocumentId(docId);
      await Chunk.deleteMany({ documentId: docId });

      // 3. Split text
      const chunks = textSplitter.splitDocument(rawText);
      if (chunks.length === 0) {
        throw new Error('No indexable text extracted from the document');
      }

      // 4. Generate embeddings & index chunks
      const savedChunksCount = await this._embedAndIndexChunks(doc, chunks);

      // 5. Finalize document status
      doc.status = 'completed';
      doc.chunkCount = savedChunksCount;
      doc.lastIndexedAt = new Date();
      await doc.save();

      logger.info(`Document parsing, chunking, and embedding finished. Saved ${savedChunksCount} chunks.`);
    } catch (err) {
      doc.status = 'failed';
      doc.errorMessage = err.message;
      await doc.save();
      throw err;
    }
  }

  async _processTextIngestion(docId, text, baseMetadata) {
    const doc = await Document.findById(docId);
    if (!doc) {
      throw new Error(`Document record not found: ${docId}`);
    }

    try {
      doc.status = 'processing';
      await doc.save();

      // Clear out any pre-existing chunks/vectors
      await vectorDbService.deleteByDocumentId(docId);
      await Chunk.deleteMany({ documentId: docId });

      // Split text
      const chunks = textSplitter.splitDocument(text);
      if (chunks.length === 0) {
        throw new Error('No indexable text provided');
      }

      // Generate embeddings & index chunks
      const savedChunksCount = await this._embedAndIndexChunks(doc, chunks, baseMetadata);

      doc.status = 'completed';
      doc.chunkCount = savedChunksCount;
      doc.lastIndexedAt = new Date();
      await doc.save();
    } catch (err) {
      doc.status = 'failed';
      doc.errorMessage = err.message;
      await doc.save();
      throw err;
    }
  }

  /**
   * Helper to embed and write chunks to MongoDB and Qdrant.
   */
  async _embedAndIndexChunks(doc, chunks, baseMetadata = {}) {
    const pointsToUpsert = [];
    const chunksToInsert = [];
    
    logger.debug(`Generating embeddings for ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const chunkId = `${doc._id}_${i}`;

      // Generate vector
      const vector = await embeddingService.getEmbedding(c.text);

      const metadata = {
        ...baseMetadata,
        title: doc.title,
        source: doc.type,
        category: baseMetadata.category || 'General',
        pageNumber: c.pageNumber || 1,
        chunkIndex: i,
        uploadedBy: doc.uploadedBy ? String(doc.uploadedBy) : 'System',
        createdAt: doc.createdAt
      };

      // Vector point
      pointsToUpsert.push({
        chunkId,
        documentId: String(doc._id),
        vector,
        title: doc.title,
        source: doc.type,
        pageNumber: c.pageNumber || 1,
        category: metadata.category,
        text: c.text,
        createdAt: doc.createdAt
      });

      // MongoDB Chunk
      chunksToInsert.push({
        documentId: doc._id,
        chunkId,
        text: c.text,
        hash: c.hash,
        chunkIndex: i,
        pageNumber: c.pageNumber || 1,
        metadata
      });
    }

    // Write to Qdrant
    await vectorDbService.upsert(pointsToUpsert);
    logger.debug(`Upserted vectors in Qdrant for document ID: ${doc._id}`);

    // Write to MongoDB
    await Chunk.insertMany(chunksToInsert);
    logger.debug(`Saved Chunk entities in MongoDB for document ID: ${doc._id}`);

    return chunks.length;
  }
}

export default new IngestionService();
