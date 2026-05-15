import mongoose from 'mongoose'

const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  arch: String,
  vram: { type: String, default: '' },
  vramGB: { type: Number, default: 0 },
  price: { type: Number, required: true },
  rangeLow: Number,
  rangeHigh: Number,
  availability: { type: String, enum: ['Low', 'Med', 'High'], default: 'Med' },
  region: { type: String, default: 'nepal' },
  sparkData: [Number],
  inStock: { type: Number, default: 10 },
  bandwidth: { type: String, default: '' },
  cpu: { type: String, default: '' },
  ram: { type: String, default: '' },
  disk: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Gpu', gpuSchema)
