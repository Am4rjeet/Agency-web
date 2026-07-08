import mongoose from 'mongoose';

const UsageLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    index: true
  },
  query: {
    type: String,
    trim: true
  },
  response: {
    type: String
  },
  latencyMs: {
    type: Number,
    default: 0
  },
  embeddingTimeMs: {
    type: Number,
    default: 0
  },
  searchTimeMs: {
    type: Number,
    default: 0
  },
  llmTimeMs: {
    type: Number,
    default: 0
  },
  tokenUsage: {
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 }
  },
  provider: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
    index: true
  },
  errorMessage: {
    type: String
  },
  ip: {
    type: String
  }
}, { timestamps: true });

// Index for aggregation queries (e.g. daily summaries)
UsageLogSchema.index({ createdAt: 1 });

export default mongoose.model('UsageLog', UsageLogSchema);
