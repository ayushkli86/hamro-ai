import mongoose from 'mongoose'

const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  arch: { type: String, index: true },
  vram: { type: String, default: '' },
  vramGB: { type: Number, default: 0, index: true },
  price: { type: Number, required: true, index: true },
  rangeLow: Number,
  rangeHigh: Number,
  availability: { type: String, enum: ['Low', 'Med', 'High'], default: 'Med', index: true },
  region: { type: String, default: 'nepal', index: true },
  sparkData: [Number],
  inStock: { type: Number, default: 10 },
  bandwidth: { type: String, default: '' },
  cpu: { type: String, default: '' },
  ram: { type: String, default: '' },
  disk: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true })

gpuSchema.index({ price: 1, vramGB: -1 })
gpuSchema.index({ arch: 1, price: 1 })
gpuSchema.index({ name: 'text', description: 'text', arch: 'text' })

export default mongoose.model('Gpu', gpuSchema)
