import express from 'express'
import protect from '../middleware/auth.js'
import adminOnly from '../middleware/admin.js'
import Gpu from '../models/Gpu.js'
import User from '../models/User.js'
import Order from '../models/Order.js'

const router = express.Router()
router.use(protect, adminOnly)

router.get('/users', async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

router.get('/orders', async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt')
  res.json(orders)
})

router.get('/gpus', async (req, res) => {
  const gpus = await Gpu.find({})
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
    { name: 'RTX PRO 6000 S', arch: 'Blackwell', vram: '48GB VRAM', price: 1.33, rangeLow: 0.73, rangeHigh: 2.00, availability: 'Med', sparkData: [35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High', sparkData: [38, 38, 35, 35, 32, 30, 28, 25, 22, 20, 22, 22] },
    { name: 'H100', arch: 'Hopper', vram: '80GB VRAM', price: 3.49, rangeLow: 2.50, rangeHigh: 4.80, availability: 'Low', sparkData: [20, 25, 22, 28, 30, 25, 20, 22, 18, 15, 12, 10] },
    { name: 'A100', arch: 'Ampere', vram: '80GB VRAM', price: 2.50, rangeLow: 1.80, rangeHigh: 3.50, availability: 'Med', sparkData: [30, 28, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14] },
    { name: 'RTX 5090', arch: 'Blackwell', vram: '32GB VRAM', price: 0.85, rangeLow: 0.45, rangeHigh: 1.80, availability: 'High', sparkData: [40, 42, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20] },
  ])
  res.json({ message: 'Seeded 5 GPUs' })
})

export default router
