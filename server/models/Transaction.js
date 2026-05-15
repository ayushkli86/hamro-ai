import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['topup', 'rental', 'refund'], required: true },
  amount: { type: Number, required: true },
  description: String,
  referenceId: String,
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
