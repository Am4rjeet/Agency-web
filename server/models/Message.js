import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  company: {
    type: String
  },
  service: {
    type: String,
    default: 'AI Solutions'
  },
  budget: {
    type: String,
    default: 'Under $5,000'
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
