import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  tags: [{ type: String }],
  price: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Work', WorkSchema);
