import mongoose from 'mongoose'

const computeJobSchema = new mongoose.Schema({
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  providerGpu: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderGpu' },
  gpuName: { type: String },
  script: { type: String, required: true },
  dockerImage: { type: String, default: 'python:3.11-slim' },
  status: {
    type: String, enum: ['pending', 'assigned', 'running', 'completed', 'failed', 'cancelled'], default: 'pending',
  },
  hoursRequested: { type: Number, required: true, min: 1, max: 720 },
  cost: { type: Number },
  result: { type: String },
  errorLog: { type: String },
  startedAt: Date,
  completedAt: Date,
}, { timestamps: true })

computeJobSchema.index({ renter: 1, createdAt: -1 })
computeJobSchema.index({ provider: 1, status: 1 })
computeJobSchema.index({ status: 1, createdAt: 1 })

export default mongoose.model('ComputeJob', computeJobSchema)
