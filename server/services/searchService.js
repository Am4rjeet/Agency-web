import Chunk from '../models/Chunk.js';
import embeddingService from './embeddingService.js';
import vectorDbService from './vectorDbService.js';
import config from '../config/aiConfig.js';
import logger from '../utils/logger.js';

class SearchService {
  /**
   * Run hybrid search and combine results.
   * @param {string} query Search query
   * @param {object} options Override settings (topK, similarityThreshold)
   * @returns {Promise<{results: Array, contextText: string}>} Context and citations
   */
  async hybridSearch(query, options = {}) {
    if (!query || typeof query !== 'string') {
      return { results: [], contextText: '' };
    }

    const topK = options.topK || config.topK || 5;
    const similarityThreshold = options.similarityThreshold || config.similarityThreshold || 0.5;
    const maxContextSize = config.maxContextSize || 12000;

    const startTime = Date.now();
    let vectorResults = [];
    let keywordResults = [];

    try {
      // 1. Parallel Execution of Vector Search & Keyword Search
      const vectorPromise = this._vectorSearch(query, topK * 2, similarityThreshold);
      const keywordPromise = this._keywordSearch(query, topK * 2);

      const [vRes, kRes] = await Promise.all([vectorPromise, keywordPromise]);
      vectorResults = vRes;
      keywordResults = kRes;

      logger.debug('Parallel hybrid search search execution times:', {
        query,
        vectorHitsCount: vectorResults.length,
        keywordHitsCount: keywordResults.length,
        latencyMs: Date.now() - startTime
      });
    } catch (err) {
      logger.error('Error during hybrid search fetch', { query, error: err.message });
      // Proceed with empty list fallbacks rather than crashing completely
    }

    // 2. Perform Reciprocal Rank Fusion (RRF)
    const fusedResults = this._applyRRF(vectorResults, keywordResults, topK);

    // 3. Construct Context Text within Max Size Limits
    let contextText = '';
    const formattedCitations = [];

    fusedResults.forEach((hit, idx) => {
      const docHeader = `[Source ${idx + 1}] Title: ${hit.metadata.title} | Source Type: ${hit.metadata.source} | Page: ${hit.metadata.pageNumber || 1}\n`;
      const docBody = `Content:\n${hit.text}\n\n`;
      
      if ((contextText + docHeader + docBody).length <= maxContextSize) {
        contextText += docHeader + docBody;
        formattedCitations.push({
          documentId: hit.documentId,
          chunkId: hit.chunkId,
          title: hit.metadata.title,
          source: hit.metadata.source,
          pageNumber: hit.metadata.pageNumber || 1
        });
      }
    });

    logger.info('Hybrid search completed', {
      query,
      returnedHits: formattedCitations.length,
      totalLatencyMs: Date.now() - startTime
    });

    return {
      results: fusedResults.slice(0, formattedCitations.length),
      citations: formattedCitations,
      contextText: contextText.trim()
    };
  }

  /* ==========================================================================
     INTERNAL RETRIEVAL DRIVERS
     ========================================================================== */

  async _vectorSearch(query, limit, threshold) {
    const queryVector = await embeddingService.getEmbedding(query);
    return vectorDbService.search(queryVector, limit, threshold);
  }

  async _keywordSearch(query, limit) {
    // Perform MongoDB text index query
    const hits = await Chunk.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('documentId');

    return hits.map(hit => ({
      chunkId: hit.chunkId,
      documentId: String(hit.documentId?._id || hit.documentId),
      text: hit.text,
      // Convert MongoDB textScore to a relative metric
      score: hit._doc.score || 1.0,
      metadata: {
        title: hit.metadata?.title || hit.documentId?.title || 'Unknown Source',
        source: hit.metadata?.source || hit.documentId?.type || 'file',
        pageNumber: hit.pageNumber || 1,
        category: hit.metadata?.category || 'General',
        createdAt: hit.createdAt
      }
    }));
  }

  /**
   * Reciprocal Rank Fusion (RRF) algorithm to combine ranks.
   * RRF Score(d) = 1 / (60 + Rank_vector(d)) + 1 / (60 + Rank_keyword(d))
   */
  _applyRRF(vectorList, keywordList, limit) {
    const k = 60; // constant parameter
    const scoreMap = new Map();

    // Map by chunkId
    vectorList.forEach((item, index) => {
      const rank = index + 1;
      const current = scoreMap.get(item.chunkId) || { item, vectorRank: Infinity, keywordRank: Infinity };
      current.vectorRank = rank;
      scoreMap.set(item.chunkId, current);
    });

    keywordList.forEach((item, index) => {
      const rank = index + 1;
      const current = scoreMap.get(item.chunkId) || { item, vectorRank: Infinity, keywordRank: Infinity };
      current.keywordRank = rank;
      scoreMap.set(item.chunkId, current);
    });

    const merged = [];
    scoreMap.forEach((val) => {
      const vectorContribution = val.vectorRank === Infinity ? 0 : 1 / (k + val.vectorRank);
      const keywordContribution = val.keywordRank === Infinity ? 0 : 1 / (k + val.keywordRank);
      const rrfScore = vectorContribution + keywordContribution;
      
      merged.push({
        ...val.item,
        rrfScore
      });
    });

    // Sort by combined RRF Score descending
    return merged.sort((a, b) => b.rrfScore - a.rrfScore).slice(0, limit);
  }
}

export default new SearchService();
