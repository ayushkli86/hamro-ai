import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['topup', 'rental', 'refund'], required: true, index: true },
  amount: { type: Number, required: true },
  description: String,
  referenceId: String,
}, { timestamps: true })

transactionSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Transaction', transactionSchema)
