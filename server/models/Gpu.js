import mongoose from 'mongoose'

const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  arch: String,
  vram: String,
  price: { type: Number, required: true },
  rangeLow: Number,
  rangeHigh: Number,
  availability: { type: String, enum: ['Low', 'Med', 'High'], default: 'Med' },
  region: { type: String, default: 'nepal' },
  sparkData: [Number],
  inStock: { type: Number, default: 10 },
}, { timestamps: true })

export default mongoose.model('Gpu', gpuSchema)
