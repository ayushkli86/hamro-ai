import express from 'express'
import authLight from '../middleware/authLight.js'
import protect from '../middleware/auth.js'
import ComputeJob from '../models/ComputeJob.js'
import ProviderGpu from '../models/ProviderGpu.js'
import Earning from '../models/Earning.js'
import User from '../models/User.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'
import logger from '../config/logger.js'

const router = express.Router()

const submitJobSchema = z.object({
  script: z.string().trim().min(1),
  dockerImage: z.string().trim().optional(),
  hoursRequested: z.coerce.number().int().min(1).max(720),
  gpuName: z.string().trim().optional(),
  minVram: z.coerce.number().optional(),
})

router.post('/', protect, validate(submitJobSchema), async (req, res) => {
  const { script, dockerImage, hoursRequested, gpuName, minVram } = req.validated

  const match = {}
  if (gpuName) match.gpuName = { $regex: gpuName, $options: 'i' }
  if (minVram) match.gpuMemory = { $gte: minVram }
  match.isOnline = true
  match.isAvailable = true

  const providerGpu = await ProviderGpu.findOne(match).sort({ pricePerHour: 1 }).lean()
  if (!providerGpu) {
    return res.status(404).json({ message: 'No available provider GPU matching your requirements' })
  }

  const cost = +(providerGpu.pricePerHour * hoursRequested).toFixed(2)
  const user = await User.findById(req.user.id)
  if (user.balance < cost) {
    return res.status(402).json({ message: `Insufficient credits. Need $${cost}, have $${user.balance}` })
  }

  user.balance -= cost
  await user.save()

  const job = await ComputeJob.create({
    renter: user._id,
    provider: providerGpu.user,
    providerGpu: providerGpu._id,
    gpuName: providerGpu.gpuName,
    script,
    dockerImage: dockerImage || 'python:3.11-slim',
    hoursRequested,
    cost,
    status: 'assigned',
  })

  logger.info({
    jobId: job._id, renter: user._id, provider: providerGpu.user, gpuName: providerGpu.gpuName, cost,
  }, 'Compute job submitted')

  res.status(201).json(job)
})

router.get('/', authLight, async (req, res) => {
  const jobs = await ComputeJob.find({ renter: req.user.id })
    .sort('-createdAt').limit(50).lean()
  res.json(jobs)
})

router.get('/:id', authLight, async (req, res) => {
  const job = await ComputeJob.findOne({ _id: req.params.id, renter: req.user.id }).lean()
  if (!job) return res.status(404).json({ message: 'Job not found' })
  res.json(job)
})

export default router
