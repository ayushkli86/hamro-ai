import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Otp', otpSchema)
