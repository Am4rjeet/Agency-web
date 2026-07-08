/**
 * Structured Logging Utility for the AI RAG Chatbot Integration.
 * Generates JSON formatted logs in production and clean readable logs in development.
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

function log(level, message, meta = {}) {
  if (LOG_LEVELS[level] > CURRENT_LEVEL) return;

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(logEntry));
  } else {
    // Colorful/readable console output for local development
    const colorReset = '\x1b[0m';
    let color = '\x1b[32m'; // Green for INFO
    if (level === 'ERROR') color = '\x1b[31m'; // Red
    if (level === 'WARN') color = '\x1b[33m'; // Yellow
    if (level === 'DEBUG') color = '\x1b[36m'; // Cyan

    const metaStr = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
    console.log(`${color}[${timestamp}] [${level}]${colorReset} ${message}${metaStr}`);
  }
}

export const logger = {
  info: (message, meta) => log('INFO', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  error: (message, meta) => log('ERROR', message, meta),
  debug: (message, meta) => log('DEBUG', message, meta)
};

export default logger;
