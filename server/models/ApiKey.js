import mongoose from 'mongoose'
import crypto from 'crypto'

function generateKey() {
  return `hamro_${crypto.randomBytes(24).toString('hex')}`
}

const apiKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  key: { type: String, unique: true, default: generateKey },
  lastUsed: Date,
  active: { type: Boolean, default: true },
}, { timestamps: true })

apiKeySchema.index({ user: 1, active: 1 })

export default mongoose.model('ApiKey', apiKeySchema)
