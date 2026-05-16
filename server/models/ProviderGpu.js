import mongoose from 'mongoose'

const providerGpuSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gpuName: { type: String, required: true },
  gpuMemory: { type: Number, required: true },
  totalMemory: { type: Number, default: 0 },
  cpuCores: { type: Number, default: 0 },
  diskSpace: { type: Number, default: 0 },
  pricePerHour: { type: Number, required: true, min: 0.01 },
  isOnline: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  region: { type: String, default: 'nepal' },
  totalEarnings: { type: Number, default: 0 },
  lastSeen: Date,
}, { timestamps: true })

providerGpuSchema.index({ isOnline: 1, isAvailable: 1, pricePerHour: 1 })

export default mongoose.model('ProviderGpu', providerGpuSchema)
