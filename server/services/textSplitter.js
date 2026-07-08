import crypto from 'crypto';
import config from '../config/aiConfig.js';

class RecursiveCharacterTextSplitter {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || config.chunkSize || 800;
    this.chunkOverlap = options.chunkOverlap || config.chunkOverlap || 150;
    this.separators = ['\n\n', '\n', ' ', ''];
  }

  /**
   * Generates an MD5 hash of the chunk text.
   * @param {string} text Chunk content
   * @returns {string} MD5 hash
   */
  getHash(text) {
    return crypto.createHash('md5').update(text.trim()).digest('hex');
  }

  /**
   * Main text splitter entrypoint.
   * @param {string} text Entire document content
   * @returns {Array<{text: string, hash: string}>} Array of chunk objects
   */
  splitDocument(text) {
    if (!text || typeof text !== 'string') return [];

    const rawChunks = this._split(text, this.separators);
    const finalizedChunks = [];

    rawChunks.forEach(chunkText => {
      const trimmed = chunkText.trim();
      if (trimmed.length > 10) { // filter out empty or extremely tiny noise
        finalizedChunks.push({
          text: trimmed,
          hash: this.getHash(trimmed)
        });
      }
    });

    return finalizedChunks;
  }

  /**
   * Internal recursive text splitter.
   */
  _split(text, separators) {
    const chunks = [];
    if (text.length <= this.chunkSize) {
      return [text];
    }

    let separator = separators[separators.length - 1];
    let nextSeparators = [];

    for (let i = 0; i < separators.length; i++) {
      const s = separators[i];
      if (s === '') {
        separator = s;
        break;
      }
      if (text.includes(s)) {
        separator = s;
        nextSeparators = separators.slice(i + 1);
        break;
      }
    }

    const splits = separator === '' ? text.split('') : text.split(separator);
    let currentDoc = [];
    
    for (const split of splits) {
      const joinedCurrentDoc = currentDoc.join(separator);
      
      if (joinedCurrentDoc.length + split.length + (currentDoc.length > 0 ? separator.length : 0) <= this.chunkSize) {
        currentDoc.push(split);
      } else {
        if (currentDoc.length > 0) {
          const docText = currentDoc.join(separator);
          chunks.push(...this._mergeOrRecurse(docText, nextSeparators));
          
          // Implement overlap logic
          // Keep items from the tail of currentDoc that fit within chunkOverlap
          let overlapDoc = [];
          for (let j = currentDoc.length - 1; j >= 0; j--) {
            const tempJoined = [currentDoc[j], ...overlapDoc].join(separator);
            if (tempJoined.length <= this.chunkOverlap) {
              overlapDoc.unshift(currentDoc[j]);
            } else {
              break;
            }
          }
          currentDoc = overlapDoc;
        }
        currentDoc.push(split);
      }
    }

    if (currentDoc.length > 0) {
      chunks.push(...this._mergeOrRecurse(currentDoc.join(separator), nextSeparators));
    }

    return chunks;
  }

  /**
   * Decides whether to keep the merged chunk or continue splitting.
   */
  _mergeOrRecurse(text, nextSeparators) {
    if (text.length <= this.chunkSize) {
      return [text];
    }
    if (nextSeparators.length === 0) {
      // Force split by chunkSize if no separators left
      const chunks = [];
      let i = 0;
      while (i < text.length) {
        chunks.push(text.slice(i, i + this.chunkSize));
        i += this.chunkSize - this.chunkOverlap;
      }
      return chunks;
    }
    return this._split(text, nextSeparators);
  }
}

export default RecursiveCharacterTextSplitter;
export const textSplitter = new RecursiveCharacterTextSplitter();
