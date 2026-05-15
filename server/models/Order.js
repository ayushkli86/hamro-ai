import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Gpu', required: true },
  gpuName: { type: String, index: true },
  hours: { type: Number, required: true },
  cost: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active', index: true },
  instanceStatus: { type: String, enum: ['provisioning', 'running', 'stopping', 'stopped', 'terminated'], default: 'provisioning' },
  region: { type: String, default: 'nepal' },
  sshHost: { type: String, default: '' },
  sshPort: { type: Number, default: 22 },
  sshUser: { type: String, default: 'root' },
  jupyterUrl: { type: String, default: '' },
}, { timestamps: true })

orderSchema.index({ user: 1, status: 1, createdAt: -1 })
orderSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Order', orderSchema)
