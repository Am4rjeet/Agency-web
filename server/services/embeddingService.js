import fetch from 'node-fetch';
import config from '../config/aiConfig.js';
import logger from '../utils/logger.js';

class EmbeddingService {
  constructor() {
    this.provider = config.embeddingProvider;
    logger.info(`Embedding service initialized with provider: ${this.provider}`);
  }

  /**
   * Get the vector dimension for the active provider.
   * @returns {number} Vector dimensions count
   */
  getVectorDimension() {
    switch (this.provider) {
      case 'openai':
        return 1536; // text-embedding-3-small default
      case 'ollama':
        return 768;  // nomic-embed-text standard, adjust as needed
      case 'gemini':
      default:
        return 768;  // gemini-embedding-001 default
    }
  }

  /**
   * Generate embedding for a single text block.
   * @param {string} text Text content
   * @returns {Promise<number[]>} Float array representing the embedding vector
   */
  async getEmbedding(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }

    const startTime = Date.now();
    try {
      let vector;
      if (this.provider === 'gemini') {
        vector = await this._getGeminiEmbedding(text);
      } else if (this.provider === 'openai') {
        vector = await this._getOpenAIEmbedding(text);
      } else if (this.provider === 'ollama') {
        vector = await this._getOllamaEmbedding(text);
      } else {
        throw new Error(`Unsupported embedding provider: ${this.provider}`);
      }

      logger.debug('Generated embedding vector successfully', {
        provider: this.provider,
        latencyMs: Date.now() - startTime,
        dimensions: vector.length
      });
      return vector;
    } catch (err) {
      logger.error('Failed to generate embedding vector', {
        provider: this.provider,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Generate embeddings for multiple text blocks in parallel.
   * @param {string[]} texts List of text strings
   * @returns {Promise<number[][]>} 2D array of vectors
   */
  async getEmbeddings(texts) {
    if (!Array.isArray(texts)) {
      throw new Error('Input must be an array of strings');
    }
    
    // In production, we execute in batches or concurrent limits
    return Promise.all(texts.map(text => this.getEmbedding(text)));
  }

  /* ==========================================================================
     PRIVATE PROVIDER DRIVERS
     ========================================================================== */

  async _getGeminiEmbedding(text) {
    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const modelName = config.embeddingModel || 'gemini-embedding-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: {
          parts: [{ text }]
        },
        outputDimensionality: this.getVectorDimension()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini Embed API returned ${response.status}: ${JSON.stringify(errorData.error || errorData)}`);
    }

    const data = await response.json();
    if (!data.embedding || !data.embedding.values) {
      throw new Error('Unexpected response format from Gemini Embed API');
    }

    return data.embedding.values;
  }

  async _getOpenAIEmbedding(text) {
    const apiKey = config.openaiApiKey;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    const modelName = config.embeddingModel || 'text-embedding-3-small';
    const url = 'https://api.openai.com/v1/embeddings';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: modelName
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Embed API returned ${response.status}: ${JSON.stringify(errorData.error || errorData)}`);
    }

    const data = await response.json();
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error('Unexpected response format from OpenAI Embed API');
    }

    return data.data[0].embedding;
  }

  async _getOllamaEmbedding(text) {
    const baseUrl = config.ollamaBaseUrl;
    const modelName = config.embeddingModel || 'nomic-embed-text';
    const url = `${baseUrl}/api/embeddings`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        prompt: text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama Embed API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.embedding) {
      throw new Error('Unexpected response format from Ollama Embed API');
    }

    return data.embedding;
  }
}

export default new EmbeddingService();
