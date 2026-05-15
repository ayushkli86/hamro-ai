import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Gpu', required: true },
  gpuName: String,
  hours: { type: Number, required: true },
  cost: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  region: { type: String, default: 'nepal' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
