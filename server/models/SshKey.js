import mongoose from 'mongoose'

const sshKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  publicKey: { type: String, required: true },
  fingerprint: String,
}, { timestamps: true })

sshKeySchema.pre('save', function (next) {
  if (!this.fingerprint && this.publicKey) {
    const parts = this.publicKey.trim().split(/\s+/)
    this.fingerprint = parts.length > 2 ? parts[2] : parts[0].slice(-20)
  }
  next()
})

export default mongoose.model('SshKey', sshKeySchema)
