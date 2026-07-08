import fetch from 'node-fetch';
import crypto from 'crypto';
import config from '../config/aiConfig.js';
import logger from '../utils/logger.js';
import embeddingService from './embeddingService.js';

/**
 * Generate a deterministic UUID from any input string.
 * Qdrant requires IDs to be either integers or valid UUIDs.
 */
function getDeterministicUuid(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

// ============================================================================
// QDRANT VECTOR DRIVER
// ============================================================================
class QdrantDriver {
  constructor() {
    this.url = config.qdrantUrl.replace(/\/$/, ''); // strip trailing slash
    this.apiKey = config.qdrantApiKey;
    this.collectionName = config.qdrantCollection;
    this.headers = { 'Content-Type': 'application/json' };
    
    if (this.apiKey) {
      this.headers['api-key'] = this.apiKey;
    }
  }

  async init() {
    logger.info(`Initializing Qdrant Collection: "${this.collectionName}"`);
    try {
      // Check if collection exists
      const response = await fetch(`${this.url}/collections/${this.collectionName}`, {
        method: 'GET',
        headers: this.headers
      });

      if (response.status === 404) {
        logger.info(`Collection "${this.collectionName}" not found. Creating a new one...`);
        const dimension = embeddingService.getVectorDimension();
        
        const createRes = await fetch(`${this.url}/collections/${this.collectionName}`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify({
            vectors: {
              size: dimension,
              distance: 'Cosine'
            }
          })
        });

        if (!createRes.ok) {
          const errMsg = await createRes.text();
          throw new Error(`Failed to create Qdrant collection: ${errMsg}`);
        }
        logger.info(`Collection "${this.collectionName}" created successfully with ${dimension} dimensions.`);
      } else if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Qdrant connection error (${response.status}): ${errMsg}`);
      } else {
        logger.info(`Collection "${this.collectionName}" is ready.`);
      }
      return true;
    } catch (err) {
      logger.error('Failed to connect or initialize Qdrant database', { error: err.message });
      throw err;
    }
  }

  async upsert(points) {
    const qdrantPoints = points.map(pt => ({
      id: getDeterministicUuid(pt.chunkId),
      vector: pt.vector,
      payload: {
        documentId: pt.documentId,
        chunkId: pt.chunkId,
        title: pt.title,
        source: pt.source,
        pageNumber: pt.pageNumber || 1,
        category: pt.category || 'General',
        text: pt.text,
        createdAt: pt.createdAt || new Date().toISOString()
      }
    }));

    const response = await fetch(`${this.url}/collections/${this.collectionName}/points`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({ points: qdrantPoints })
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Qdrant upsert error: ${errMsg}`);
    }
    return true;
  }

  async deleteByDocumentId(documentId) {
    const response = await fetch(`${this.url}/collections/${this.collectionName}/points/delete`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        filter: {
          must: [
            {
              key: 'documentId',
              match: {
                value: String(documentId)
              }
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Qdrant delete error: ${errMsg}`);
    }
    return true;
  }

  async search(queryVector, limit = 5, scoreThreshold = 0.5) {
    const response = await fetch(`${this.url}/collections/${this.collectionName}/points/search`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        vector: queryVector,
        limit,
        score_threshold: scoreThreshold,
        with_payload: true
      })
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Qdrant search error: ${errMsg}`);
    }

    const data = await response.json();
    return (data.result || []).map(hit => ({
      chunkId: hit.payload.chunkId,
      documentId: hit.payload.documentId,
      text: hit.payload.text,
      score: hit.score,
      metadata: {
        title: hit.payload.title,
        source: hit.payload.source,
        pageNumber: hit.payload.pageNumber,
        category: hit.payload.category,
        createdAt: hit.payload.createdAt
      }
    }));
  }

  async getCollectionStats() {
    const response = await fetch(`${this.url}/collections/${this.collectionName}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve stats: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      vectorsCount: data.result?.vectors_count || 0,
      pointsCount: data.result?.points_count || 0,
      status: data.result?.status || 'unknown',
      optimizerStatus: data.result?.optimizer_status || 'unknown'
    };
  }
}

// ============================================================================
// MOCK IN-MEMORY VECTOR DRIVER
// ============================================================================
class MockVectorDriver {
  constructor() {
    this.store = []; // in-memory store
  }

  async init() {
    logger.warn('WARNING: Using Mock Vector Database (In-Memory Fallback). Vectors will reset on server restart.');
    return true;
  }

  async upsert(points) {
    for (const pt of points) {
      // Avoid duplicate chunk ids
      this.store = this.store.filter(item => item.chunkId !== pt.chunkId);
      this.store.push({
        id: getDeterministicUuid(pt.chunkId),
        vector: pt.vector,
        documentId: pt.documentId,
        chunkId: pt.chunkId,
        title: pt.title,
        source: pt.source,
        pageNumber: pt.pageNumber || 1,
        category: pt.category || 'General',
        text: pt.text,
        createdAt: pt.createdAt || new Date().toISOString()
      });
    }
    return true;
  }

  async deleteByDocumentId(documentId) {
    this.store = this.store.filter(item => item.documentId !== String(documentId));
    return true;
  }

  async search(queryVector, limit = 5, scoreThreshold = 0.5) {
    // Simple cosine similarity: dot product since vectors are normalized (or standard dot product)
    const hits = this.store.map(item => {
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;

      for (let i = 0; i < queryVector.length; i++) {
        const valA = queryVector[i];
        const valB = item.vector[i] || 0;
        dotProduct += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
      }
      const score = normA && normB ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;

      return { item, score };
    });

    // Sort and filter
    return hits
      .filter(hit => hit.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(hit => ({
        chunkId: hit.item.chunkId,
        documentId: hit.item.documentId,
        text: hit.item.text,
        score: hit.score,
        metadata: {
          title: hit.item.title,
          source: hit.item.source,
          pageNumber: hit.item.pageNumber,
          category: hit.item.category,
          createdAt: hit.item.createdAt
        }
      }));
  }

  async getCollectionStats() {
    return {
      vectorsCount: this.store.length,
      pointsCount: this.store.length,
      status: 'green (mock)',
      optimizerStatus: 'ok (mock)'
    };
  }
}

// ============================================================================
// DYNAMIC EXPORT / MANAGER SELECTOR
// ============================================================================
class VectorDbManager {
  constructor() {
    this.driverType = config.vectorDb;
    this.activeDriver = null;
  }

  async getDriver() {
    if (this.activeDriver) return this.activeDriver;

    if (this.driverType === 'qdrant') {
      const driver = new QdrantDriver();
      try {
        await driver.init();
        this.activeDriver = driver;
        logger.info('Qdrant active driver loaded successfully.');
      } catch (err) {
        logger.warn(`Qdrant initialization failed: "${err.message}". Falling back to Mock Vector DB.`);
        const fallback = new MockVectorDriver();
        await fallback.init();
        this.activeDriver = fallback;
      }
    } else {
      const driver = new MockVectorDriver();
      await driver.init();
      this.activeDriver = driver;
    }

    return this.activeDriver;
  }
}

const manager = new VectorDbManager();

// Export proxies to active driver
export const vectorDbService = {
  init: async () => {
    const drv = await manager.getDriver();
    return drv.init ? drv.init() : true;
  },
  upsert: async (points) => {
    const drv = await manager.getDriver();
    return drv.upsert(points);
  },
  deleteByDocumentId: async (documentId) => {
    const drv = await manager.getDriver();
    return drv.deleteByDocumentId(documentId);
  },
  search: async (queryVector, limit, scoreThreshold) => {
    const drv = await manager.getDriver();
    return drv.search(queryVector, limit, scoreThreshold);
  },
  getCollectionStats: async () => {
    const drv = await manager.getDriver();
    return drv.getCollectionStats();
  }
};

export default vectorDbService;
