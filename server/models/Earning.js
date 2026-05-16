import mongoose from 'mongoose'

const earningSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'ComputeJob', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'available', 'withdrawn'], default: 'pending' },
}, { timestamps: true })

earningSchema.index({ provider: 1, status: 1 })

export default mongoose.model('Earning', earningSchema)
