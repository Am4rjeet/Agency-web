import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

import mammoth from 'mammoth';
import logger from '../utils/logger.js';

class DocumentParser {
  /**
   * Parse a file buffer into plain text.
   * @param {Buffer} buffer File buffer
   * @param {string} mimeType MIME type of the file
   * @returns {Promise<string>} Parsed plain text content
   */
  async parseBuffer(buffer, mimeType) {
    if (!buffer || !(buffer instanceof Buffer)) {
      throw new Error('Invalid file buffer');
    }

    logger.debug(`Parsing document buffer with MIME type: ${mimeType}`);

    switch (mimeType) {
      case 'application/pdf':
        return this._parsePdf(buffer);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this._parseDocx(buffer);
      
      case 'text/plain':
      case 'text/markdown':
      case 'text/x-markdown':
        return this._parseText(buffer);
      
      default:
        throw new Error(`Unsupported MIME type for text parsing: ${mimeType}`);
    }
  }

  /* ==========================================================================
     PRIVATE PARSING ROUTINES
     ========================================================================== */

  async _parsePdf(buffer) {
    try {
      // pdf-parse extracts the text and returns an object
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      logger.error('Error parsing PDF document', { error: err.message });
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  }

  async _parseDocx(buffer) {
    try {
      // mammoth extracts raw text from DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (err) {
      logger.error('Error parsing DOCX document', { error: err.message });
      throw new Error(`Word (DOCX) parsing failed: ${err.message}`);
    }
  }

  _parseText(buffer) {
    try {
      return buffer.toString('utf-8');
    } catch (err) {
      logger.error('Error reading plain text document', { error: err.message });
      throw new Error(`Plain text reading failed: ${err.message}`);
    }
  }
}

export default new DocumentParser();
