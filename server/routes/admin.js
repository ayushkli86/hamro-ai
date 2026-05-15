import express from 'express'
import protect from '../middleware/auth.js'
import adminOnly from '../middleware/admin.js'
import Gpu from '../models/Gpu.js'
import User from '../models/User.js'
import Order from '../models/Order.js'

const router = express.Router()
router.use(protect, adminOnly)

router.get('/users', async (req, res) => {
  const users = await User.find({}).select('-password').lean()
  res.json(users)
})

router.get('/orders', async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt').lean()
  res.json(orders)
})

router.get('/gpus', async (req, res) => {
  const gpus = await Gpu.find({}).lean()
  res.json(gpus)
})

router.post('/gpus', async (req, res) => {
  const gpu = await Gpu.create(req.body)
  res.status(201).json(gpu)
})

router.put('/gpus/:id', async (req, res) => {
  const gpu = await Gpu.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.json(gpu)
})

router.delete('/gpus/:id', async (req, res) => {
  const gpu = await Gpu.findByIdAndDelete(req.params.id)
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.json({ message: 'GPU deleted' })
})

router.post('/seed', async (req, res) => {
  await Gpu.deleteMany({})
  await Gpu.insertMany([
    { name: 'RTX PRO 6000 S', arch: 'Blackwell', vram: '48GB VRAM', vramGB: 48, price: 1.33, rangeLow: 0.73, rangeHigh: 2.00, availability: 'Med', bandwidth: '1.8 TB/s', cpu: 'AMD EPYC 64 vCPU', ram: '256 GB', disk: '1 TB NVMe', description: 'Professional-grade GPU for AI training and inference.', sparkData: [35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', vramGB: 24, price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High', bandwidth: '1.0 TB/s', cpu: 'AMD EPYC 32 vCPU', ram: '128 GB', disk: '512 GB NVMe', description: 'Best value GPU for inference and rendering.', sparkData: [38, 38, 35, 35, 32, 30, 28, 25, 22, 20, 22, 22] },
    { name: 'H100', arch: 'Hopper', vram: '80GB VRAM', vramGB: 80, price: 3.49, rangeLow: 2.50, rangeHigh: 4.80, availability: 'Low', bandwidth: '3.35 TB/s', cpu: 'AMD EPYC 96 vCPU', ram: '512 GB', disk: '2 TB NVMe', description: 'Flagship data center GPU for large-scale AI training.', sparkData: [20, 25, 22, 28, 30, 25, 20, 22, 18, 15, 12, 10] },
    { name: 'A100', arch: 'Ampere', vram: '80GB VRAM', vramGB: 80, price: 2.50, rangeLow: 1.80, rangeHigh: 3.50, availability: 'Med', bandwidth: '2.0 TB/s', cpu: 'AMD EPYC 64 vCPU', ram: '256 GB', disk: '1 TB NVMe', description: 'Proven data center GPU for AI and HPC.', sparkData: [30, 28, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14] },
    { name: 'RTX 5090', arch: 'Blackwell', vram: '32GB VRAM', vramGB: 32, price: 0.85, rangeLow: 0.45, rangeHigh: 1.80, availability: 'High', bandwidth: '1.8 TB/s', cpu: 'AMD EPYC 32 vCPU', ram: '128 GB', disk: '1 TB NVMe', description: 'Next-gen consumer GPU with Blackwell architecture.', sparkData: [40, 42, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20] },
    { name: 'B200', arch: 'Blackwell', vram: '192GB VRAM', vramGB: 192, price: 5.50, rangeLow: 4.00, rangeHigh: 7.00, availability: 'Low', bandwidth: '8.0 TB/s', cpu: 'AMD EPYC 128 vCPU', ram: '1024 GB', disk: '4 TB NVMe', description: 'Enterprise Blackwell GPU for trillion-parameter models.', sparkData: [10, 12, 15, 18, 20, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'L40S', arch: 'Ada Lovelace', vram: '48GB VRAM', vramGB: 48, price: 1.75, rangeLow: 1.20, rangeHigh: 2.80, availability: 'Med', bandwidth: '864 GB/s', cpu: 'AMD EPYC 48 vCPU', ram: '192 GB', disk: '1 TB NVMe', description: 'Universal GPU for inference, graphics, and rendering.', sparkData: [25, 28, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12] },
  ])
  res.json({ message: 'Seeded 7 GPUs' })
})

export default router
