import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reference: { type: String },
  status: { type: String, enum: ['initialized', 'escrow', 'released', 'refunded', 'failed'], default: 'initialized' },
  channel: { type: String, default: 'paystack' },
  meta: {}
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
