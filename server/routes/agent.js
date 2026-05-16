import express from 'express'
import authLight from '../middleware/authLight.js'
import ProviderGpu from '../models/ProviderGpu.js'
import ComputeJob from '../models/ComputeJob.js'
import Earning from '../models/Earning.js'
import logger from '../config/logger.js'

const router = express.Router()

router.post('/register', authLight, async (req, res) => {
  const { gpuName, gpuMemory, totalMemory, cpuCores, diskSpace, pricePerHour, region } = req.body
  let gpu = await ProviderGpu.findOne({ user: req.user.id, gpuName })
  if (gpu) {
    gpu.isOnline = true
    gpu.lastSeen = new Date()
    if (gpuMemory) gpu.gpuMemory = gpuMemory
    if (pricePerHour) gpu.pricePerHour = pricePerHour
    await gpu.save()
  } else {
    gpu = await ProviderGpu.create({
      user: req.user.id, gpuName, gpuMemory, totalMemory, cpuCores, diskSpace,
      pricePerHour: pricePerHour || 0.10, region: region || 'nepal', isOnline: true, lastSeen: new Date(),
    })
  }
  logger.info({ userId: req.user.id, gpuId: gpu._id, gpuName }, 'Agent registered GPU')
  res.json({ gpuId: gpu._id })
})

router.post('/heartbeat', authLight, async (req, res) => {
  const { gpuId } = req.body
  await ProviderGpu.findOneAndUpdate(
    { _id: gpuId, user: req.user.id },
    { $set: { isOnline: true, lastSeen: new Date() } }
  )
  res.json({ ok: true })
})

router.get('/jobs', authLight, async (req, res) => {
  const gpus = await ProviderGpu.find({ user: req.user.id }).select('_id').lean()
  const gpuIds = gpus.map(g => g._id)
  const job = await ComputeJob.findOne({
    providerGpu: { $in: gpuIds }, status: { $in: ['assigned'] },
  }).sort({ createdAt: 1 }).lean()
  res.json({ job: job || null })
})

router.patch('/jobs/:id', authLight, async (req, res) => {
  const { status, result, errorLog } = req.body
  const update = { status }
  if (status === 'running') update.startedAt = new Date()
  if (status === 'completed' || status === 'failed') update.completedAt = new Date()
  if (result) update.result = result
  if (errorLog) update.errorLog = errorLog

  const job = await ComputeJob.findOneAndUpdate(
    { _id: req.params.id, provider: req.user.id },
    { $set: update },
    { new: true }
  )
  if (!job) return res.status(404).json({ message: 'Job not found' })

  if (status === 'completed' && job.cost) {
    const platformCut = job.cost * 0.15
    await Earning.create({ provider: job.provider, job: job._id, amount: job.cost - platformCut, status: 'available' })
    await ProviderGpu.findOneAndUpdate(
      { user: job.provider, _id: job.providerGpu },
      { $inc: { totalEarnings: job.cost - platformCut } }
    )
  }

  res.json(job)
})

export default router
