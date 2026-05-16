import express from 'express'
import authLight from '../middleware/authLight.js'
import ProviderGpu from '../models/ProviderGpu.js'
import Earning from '../models/Earning.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'
import logger from '../config/logger.js'

const router = express.Router()

const registerGpuSchema = z.object({
  gpuName: z.string().trim().min(1),
  gpuMemory: z.number().min(1),
  totalMemory: z.number().optional(),
  cpuCores: z.number().optional(),
  diskSpace: z.number().optional(),
  pricePerHour: z.number().min(0.01),
  region: z.string().trim().optional(),
})

router.get('/gpus', authLight, async (req, res) => {
  const gpus = await ProviderGpu.find({ user: req.user.id }).sort('-createdAt').lean()
  res.json(gpus)
})

router.post('/gpus', authLight, validate(registerGpuSchema), async (req, res) => {
  const gpu = await ProviderGpu.create({ user: req.user.id, ...req.validated })
  logger.info({ userId: req.user.id, gpuId: gpu._id, gpuName: gpu.gpuName }, 'Provider GPU registered')
  res.status(201).json(gpu)
})

router.patch('/gpus/:id', authLight, async (req, res) => {
  const { pricePerHour, isAvailable, region } = req.body
  const update = {}
  if (pricePerHour) update.pricePerHour = pricePerHour
  if (isAvailable !== undefined) update.isAvailable = isAvailable
  if (region) update.region = region
  const gpu = await ProviderGpu.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: update },
    { new: true, runValidators: true }
  )
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.json(gpu)
})

router.get('/earnings', authLight, async (req, res) => {
  const earnings = await Earning.find({ provider: req.user.id }).sort('-createdAt').lean()
  const total = earnings.reduce((s, e) => s + (e.status !== 'withdrawn' ? e.amount : 0), 0)
  res.json({ earnings, totalAvailable: total })
})

router.post('/withdraw', authLight, async (req, res) => {
  const pending = await Earning.find({ provider: req.user.id, status: { $in: ['pending', 'available'] } })
  const total = pending.reduce((s, e) => s + e.amount, 0)
  if (total < 5) return res.status(400).json({ message: 'Minimum withdrawal is $5' })
  await Earning.updateMany(
    { provider: req.user.id, status: { $in: ['pending', 'available'] } },
    { $set: { status: 'withdrawn' } }
  )
  logger.info({ userId: req.user.id, amount: total }, 'Withdrawal requested')
  res.json({ message: `Withdrawal of $${total.toFixed(2)} requested. Processing...` })
})

export default router
