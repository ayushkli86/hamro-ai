import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiresAt: Date,
  active: { type: Boolean, default: true },
}, { timestamps: true })

couponSchema.index({ code: 1, active: 1 })

export default mongoose.model('Coupon', couponSchema)
