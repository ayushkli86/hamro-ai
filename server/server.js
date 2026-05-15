import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import gpuRoutes from './routes/gpus.js'
import orderRoutes from './routes/orders.js'
import apikeyRoutes from './routes/apikeys.js'
import sshkeyRoutes from './routes/sshkeys.js'
import adminRoutes from './routes/admin.js'
import { initSocket } from './config/socket.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, try again later' },
})

const app = express()
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
app.use(cors())
app.use(express.json())
app.use('/api/', limiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/signup', authLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/gpus', gpuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/apikeys', apikeyRoutes)
app.use('/api/sshkeys', sshkeyRoutes)
app.use('/api/admin', adminRoutes)

if (isProd) {
  app.use(express.static(path.join(__dirname, '..', 'dist')))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API route not found' })
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })
}

app.get('/api/seed', async (req, res) => {
  const { default: Gpu } = await import('./models/Gpu.js')
  const { default: User } = await import('./models/User.js')
  await Gpu.deleteMany({})
  await Gpu.insertMany([
    { name: 'RTX PRO 6000 S', arch: 'Blackwell', vram: '48GB VRAM', price: 1.33, rangeLow: 0.73, rangeHigh: 2.00, availability: 'Med', sparkData: [35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High', sparkData: [38, 38, 35, 35, 32, 30, 28, 25, 22, 20, 22, 22] },
    { name: 'H100', arch: 'Hopper', vram: '80GB VRAM', price: 3.49, rangeLow: 2.50, rangeHigh: 4.80, availability: 'Low', sparkData: [20, 25, 22, 28, 30, 25, 20, 22, 18, 15, 12, 10] },
    { name: 'A100', arch: 'Ampere', vram: '80GB VRAM', price: 2.50, rangeLow: 1.80, rangeHigh: 3.50, availability: 'Med', sparkData: [30, 28, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14] },
    { name: 'RTX 5090', arch: 'Blackwell', vram: '32GB VRAM', price: 0.85, rangeLow: 0.45, rangeHigh: 1.80, availability: 'High', sparkData: [40, 42, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20] },
  ])
  const admin = await User.findOne({ email: 'admin@hamro.ai' })
  if (!admin) {
    await User.create({ name: 'Admin', email: 'admin@hamro.ai', password: 'admin123', balance: 9999, isAdmin: true })
  }
  res.json({ message: 'Seeded 5 GPUs + admin user' })
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`hamro.ai server running on port ${PORT}`)
  console.log(`Mode: ${isProd ? 'production' : 'development'}`)
  if (isProd) console.log(`Serving frontend from: ${path.join(__dirname, '..', 'dist')}`)
})

initSocket(server)
connectDB()
