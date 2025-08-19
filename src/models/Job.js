import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  budget: { type: Number, required: true },
  category: String,
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
