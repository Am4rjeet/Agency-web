import mongoose from 'mongoose';

const ChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  chunkId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  pageNumber: {
    type: Number
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Text index to support full-text keyword search in hybrid search queries
ChunkSchema.index({ text: 'text' });
ChunkSchema.index({ documentId: 1 });

export default mongoose.model('Chunk', ChunkSchema);
