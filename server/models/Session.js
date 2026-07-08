import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  citations: [{
    documentId: {
      type: String
    },
    chunkId: {
      type: String
    },
    title: {
      type: String
    },
    source: {
      type: String
    },
    pageNumber: {
      type: Number
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [MessageSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Session', SessionSchema);
