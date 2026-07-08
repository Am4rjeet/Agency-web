import fetch from 'node-fetch';
import config from '../config/aiConfig.js';
import logger from '../utils/logger.js';

class AIProviderManager {
  constructor() {
    this.provider = config.aiProvider;
    this.modelName = config.aiModel;
    logger.info(`AI provider manager initialized: provider=${this.provider}, model=${this.modelName}`);
  }

  /**
   * Helper to perform basic Prompt Injection checks.
   * @param {string} text User input string
   * @returns {boolean} True if suspicious injection pattern found
   */
  isPromptInjectionAttempt(text) {
    if (!text || typeof text !== 'string') return false;
    
    const injectionPatterns = [
      /ignore\s+(any|all)?\s*previous\s+instructions/i,
      /ignore\s+above\s+instructions/i,
      /disregard\s+(any|all)?\s*previous\s+instructions/i,
      /system\s+override/i,
      /you\s+are\s+now\s+a\s+different\s+ai/i,
      /instead\s+of\s+answering/i,
      /ignore\s+your\s+rules/i,
      /bypass\s+restrictions/i
    ];

    return injectionPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Automatically trim history turns so they fit inside token/size budgets.
   * Trims from the oldest conversation turns first, keeping the system instructions intact.
   */
  trimMessageHistory(history, maxCharacters = 16000) {
    if (!Array.isArray(history) || history.length === 0) return [];
    
    let totalLength = 0;
    const trimmed = [];

    // Keep newer messages (iterate backwards)
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const msgLength = msg.content.length;
      
      if (totalLength + msgLength <= maxCharacters) {
        trimmed.unshift(msg);
        totalLength += msgLength;
      } else {
        logger.debug(`History trim threshold met. Dropping ${i + 1} older message entries.`);
        break;
      }
    }

    return trimmed;
  }

  /**
   * Main completion handler (non-streaming fallback).
   */
  async generateResponse(systemPrompt, userQuery, history = [], options = {}) {
    if (this.isPromptInjectionAttempt(userQuery)) {
      logger.warn('Prompt injection block triggered on input query.', { query: userQuery });
      return {
        text: 'I detected a prompt instruction override attempt. I can only assist with information contained in my knowledge base.',
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    }

    const trimmedHistory = this.trimMessageHistory(history);
    
    switch (this.provider) {
      case 'openai':
        return this._callOpenAI(systemPrompt, userQuery, trimmedHistory, options);
      case 'ollama':
        return this._callOllama(systemPrompt, userQuery, trimmedHistory, options);
      case 'gemini':
      default:
        return this._callGemini(systemPrompt, userQuery, trimmedHistory, options);
    }
  }

  /**
   * Streaming handler sending Server-Sent Events (SSE) direct to the HTTP response write pipeline.
   */
  async generateStreamResponse(systemPrompt, userQuery, history = [], writeCallback, errorCallback, options = {}) {
    if (this.isPromptInjectionAttempt(userQuery)) {
      writeCallback('I detected a prompt instruction override attempt. I can only assist with information contained in my knowledge base.');
      return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    }

    const trimmedHistory = this.trimMessageHistory(history);

    try {
      if (this.provider === 'openai') {
        return this._streamOpenAI(systemPrompt, userQuery, trimmedHistory, writeCallback, options);
      } else if (this.provider === 'ollama') {
        return this._streamOllama(systemPrompt, userQuery, trimmedHistory, writeCallback, options);
      } else {
        // default to gemini
        return this._streamGemini(systemPrompt, userQuery, trimmedHistory, writeCallback, options);
      }
    } catch (err) {
      logger.error('Streaming API generation error', { error: err.message });
      errorCallback(err);
    }
  }

  /* ==========================================================================
     PROVIDER IMPLEMENTATIONS - STANDARD / CALL
     ========================================================================== */

  async _callGemini(systemPrompt, userQuery, history, options) {
    const apiKey = config.geminiApiKey;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined in environment variables');

    const model = this.modelName || 'gemini-3.1-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Map message history to Gemini API format (roles: 'user', 'model')
    const contents = [];
    history.forEach(msg => {
      contents.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`Gemini generate API error: ${errTxt}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Estimate tokens
    const promptTokens = Math.ceil((systemPrompt.length + userQuery.length) / 4);
    const completionTokens = Math.ceil(text.length / 4);

    return {
      text,
      tokenUsage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      }
    };
  }

  async _callOpenAI(systemPrompt, userQuery, history, options) {
    const apiKey = config.openaiApiKey;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');

    const model = this.modelName || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: userQuery });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.2
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`OpenAI completion API error: ${errTxt}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    return {
      text,
      tokenUsage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }

  async _callOllama(systemPrompt, userQuery, history, options) {
    const baseUrl = config.ollamaBaseUrl;
    const model = this.modelName || 'llama3';
    const url = `${baseUrl}/api/chat`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: userQuery });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        options: { temperature: options.temperature || 0.2 },
        stream: false
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`Ollama completion API error: ${errTxt}`);
    }

    const data = await response.json();
    const text = data.message?.content || '';
    
    // Ollama token count estimations
    const promptTokens = Math.ceil((systemPrompt.length + userQuery.length) / 4);
    const completionTokens = Math.ceil(text.length / 4);

    return {
      text,
      tokenUsage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      }
    };
  }

  /* ==========================================================================
     PROVIDER IMPLEMENTATIONS - STREAMING
     ========================================================================== */

  async _streamGemini(systemPrompt, userQuery, history, writeCallback, options) {
    const apiKey = config.geminiApiKey;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

    const model = this.modelName || 'gemini-3.1-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

    const contents = [];
    history.forEach(msg => {
      contents.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`Gemini stream API error: ${errTxt}`);
    }

    // Read response body as text block stream
    const reader = response.body;
    let buffer = '';
    let fullResponseText = '';

    await new Promise((resolve, reject) => {
      reader.on('data', chunk => {
        buffer += chunk.toString();
        
        let lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in the buffer
        
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ')) {
            try {
              const data = JSON.parse(cleanLine.slice(6));
              const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                writeCallback(textChunk);
                fullResponseText += textChunk;
              }
            } catch (e) {
              // Parse error on incomplete line segment
            }
          }
        }
      });

      reader.on('end', () => {
        const finalBuffer = buffer.trim();
        if (finalBuffer.startsWith('data: ')) {
          try {
            const data = JSON.parse(finalBuffer.slice(6));
            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textChunk) {
              writeCallback(textChunk);
              fullResponseText += textChunk;
            }
          } catch (e) {
            // Ignore parse errors on the final buffer
          }
        }
        resolve();
      });
      reader.on('error', err => reject(err));
    });

    const promptTokens = Math.ceil((systemPrompt.length + userQuery.length) / 4);
    const completionTokens = Math.ceil(fullResponseText.length / 4);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }

  async _streamOpenAI(systemPrompt, userQuery, history, writeCallback, options) {
    const apiKey = config.openaiApiKey;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');

    const model = this.modelName || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: userQuery });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.2,
        stream: true
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`OpenAI stream API error: ${errTxt}`);
    }

    const reader = response.body;
    let fullResponseText = '';

    await new Promise((resolve, reject) => {
      reader.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            break;
          }
          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              writeCallback(content);
              fullResponseText += content;
            }
          } catch (e) {
            // Wait for complete SSE frame
          }
        }
      });

      reader.on('end', () => resolve());
      reader.on('error', err => reject(err));
    });

    const promptTokens = Math.ceil((systemPrompt.length + userQuery.length) / 4);
    const completionTokens = Math.ceil(fullResponseText.length / 4);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }

  async _streamOllama(systemPrompt, userQuery, history, writeCallback, options) {
    const baseUrl = config.ollamaBaseUrl;
    const model = this.modelName || 'llama3';
    const url = `${baseUrl}/api/chat`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: userQuery });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        options: { temperature: options.temperature || 0.2 },
        stream: true
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`Ollama stream API error: ${errTxt}`);
    }

    const reader = response.body;
    let fullResponseText = '';

    await new Promise((resolve, reject) => {
      reader.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            const content = parsed.message?.content;
            if (content) {
              writeCallback(content);
              fullResponseText += content;
            }
          } catch (e) {
            // Wait for complete JSON line
          }
        }
      });

      reader.on('end', () => resolve());
      reader.on('error', err => reject(err));
    });

    const promptTokens = Math.ceil((systemPrompt.length + userQuery.length) / 4);
    const completionTokens = Math.ceil(fullResponseText.length / 4);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }
}

export default new AIProviderManager();
