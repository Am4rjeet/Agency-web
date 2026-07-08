import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  metric: {
    type: String,
    required: true
  },
  tech: {
    type: [String],
    default: []
  },
  desc: {
    type: String,
    required: true
  },
  challenge: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
