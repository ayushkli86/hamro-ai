import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import passport from 'passport'
import { v4 as uuidv4 } from 'uuid'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'ioredis'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import mongoose from 'mongoose'
import logger from './config/logger.js'
import authRoutes from './routes/auth.js'
import gpuRoutes from './routes/gpus.js'
import orderRoutes from './routes/orders.js'
import apikeyRoutes from './routes/apikeys.js'
import sshkeyRoutes from './routes/sshkeys.js'
import transactionRoutes from './routes/transactions.js'
import subscribeRoutes from './routes/subscribe.js'
import adminRoutes from './routes/admin.js'
import paymentRoutes from './routes/payment.js'
import oauthRoutes from './routes/oauth.js'
import stripeRoutes from './routes/stripe.js'
import khaltiRoutes from './routes/khalti.js'
import twofactorRoutes from './routes/twofactor.js'
import providerRoutes from './routes/provider.js'
import agentRoutes from './routes/agent.js'
import jobRoutes from './routes/jobs.js'
import { initSocket } from './config/socket.js'
import { initPassport } from './config/passport.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import Order from './models/Order.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

if (!process.env.JWT_SECRET) {
  logger.fatal('JWT_SECRET is not set')
  process.exit(1)
}

const isLoadTest = process.env.LOAD_TEST === 'true'
const LOAD_MAX = 9_999_999

const rateLimitStore = process.env.REDIS_URL
  ? new RedisStore({ client: createClient(process.env.REDIS_URL), prefix: 'rl:' })
  : undefined

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isLoadTest ? LOAD_MAX : 200,
  standardHeaders: true,
  legacyHeaders: false,
  store: rateLimitStore,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isLoadTest ? LOAD_MAX : 10,
  message: { message: 'Too many attempts, try again later' },
  store: rateLimitStore,
})

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isLoadTest ? LOAD_MAX : 1,
  message: { message: 'Too many OTP requests. Try again in 1 minute.' },
  store: rateLimitStore,
})

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isLoadTest ? LOAD_MAX : 50,
  message: { message: 'Too many admin requests' },
  store: rateLimitStore,
})

const app = express()
export { app }
initPassport()
app.use(passport.initialize())
app.use((req, res, next) => { req.id = uuidv4().slice(0, 8); res.set('X-Request-Id', req.id); next() })
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}))
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))

import { constructWebhookEvent } from './config/stripe.js'
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = await constructWebhookEvent(req.body, sig)
  } catch (err) {
    logger.error({ err: err.message }, 'Stripe webhook error')
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  if (event?.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    const amount = parseFloat(session.metadata?.amount || '0')
    if (userId && amount && session.payment_status === 'paid') {
      const user = await User.findById(userId)
      if (user) {
        user.balance += amount
        await user.save()
        await Transaction.create({ user: userId, type: 'topup', amount, description: `Stripe payment`, referenceId: session.id })
        logger.info({ userId, amount, stripeSessionId: session.id }, 'Payment completed')
      }
    }
  }
  res.json({ received: true })
})

app.use(express.json({ limit: '100kb' }))
app.use((req, res, next) => { res.set('X-RateLimit-Limit', '200'); next() })
app.use('/api/', limiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/signup', authLimiter)

app.use('/api/', (req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('X-Frame-Options', 'DENY')
  res.set('X-XSS-Protection', '1; mode=block')
  if (req.path.startsWith('/api/auth') && req.method !== 'GET') {
    res.set('Cache-Control', 'no-store')
  }
  next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec))
app.use('/api/health', async (req, res) => {
  const checks = { status: 'ok', time: Date.now(), uptime: process.uptime() }
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping()
      checks.mongo = 'connected'
    } else {
      checks.mongo = 'disconnected'
      checks.status = 'degraded'
    }
  } catch { checks.mongo = 'error'; checks.status = 'degraded' }
  if (process.env.REDIS_URL) {
    try {
      const redis = createClient(process.env.REDIS_URL)
      await redis.ping()
      checks.redis = 'connected'
      redis.disconnect()
    } catch { checks.redis = 'error'; checks.status = 'degraded' }
  }
  res.status(checks.status === 'ok' ? 200 : 503).json(checks)
})

if (!isProd && !isLoadTest) {
  app.use('/api/', (req, res, next) => {
    const start = Date.now()
    res.on('finish', () => logger.info({ method: req.method, url: req.originalUrl, status: res.statusCode, duration: `${Date.now() - start}ms` }))
    next()
  })
}

app.use('/api/auth', authRoutes)
app.use('/api/gpus', gpuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/apikeys', apikeyRoutes)
app.use('/api/sshkeys', sshkeyRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/subscribe', subscribeRoutes)
app.use('/api/admin', adminLimiter, adminRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/khalti', khaltiRoutes)
app.use('/api/auth/phone/send-otp', otpLimiter)
app.use('/api/auth', oauthRoutes)
app.use('/api/auth/2fa', twofactorRoutes)
app.use('/api/provider', providerRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/jobs', jobRoutes)

app.get('/api/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not available in production' })
  const { default: Gpu } = await import('./models/Gpu.js')
  const { default: User } = await import('./models/User.js')
  await Gpu.deleteMany({})
  await Gpu.insertMany([
    { name: 'RTX PRO 6000 S', arch: 'Blackwell', vram: '48GB VRAM', vramGB: 48, price: 1.33, rangeLow: 0.73, rangeHigh: 2.00, availability: 'Med', bandwidth: '1.8 TB/s', cpu: 'AMD EPYC 64 vCPU', ram: '256 GB', disk: '1 TB NVMe', description: 'Professional-grade GPU for AI training and inference with Blackwell architecture.', sparkData: [35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', vramGB: 24, price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High', bandwidth: '1.0 TB/s', cpu: 'AMD EPYC 32 vCPU', ram: '128 GB', disk: '512 GB NVMe', description: 'Best value GPU for AI inference, fine-tuning, and rendering workloads.', sparkData: [38, 38, 35, 35, 32, 30, 28, 25, 22, 20, 22, 22] },
    { name: 'H100', arch: 'Hopper', vram: '80GB VRAM', vramGB: 80, price: 3.49, rangeLow: 2.50, rangeHigh: 4.80, availability: 'Low', bandwidth: '3.35 TB/s', cpu: 'AMD EPYC 96 vCPU', ram: '512 GB', disk: '2 TB NVMe', description: 'NVIDIA\'s flagship data center GPU for large-scale AI training and LLMs.', sparkData: [20, 25, 22, 28, 30, 25, 20, 22, 18, 15, 12, 10] },
    { name: 'A100', arch: 'Ampere', vram: '80GB VRAM', vramGB: 80, price: 2.50, rangeLow: 1.80, rangeHigh: 3.50, availability: 'Med', bandwidth: '2.0 TB/s', cpu: 'AMD EPYC 64 vCPU', ram: '256 GB', disk: '1 TB NVMe', description: 'Proven data center GPU for AI, HPC, and data analytics workloads.', sparkData: [30, 28, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14] },
    { name: 'RTX 5090', arch: 'Blackwell', vram: '32GB VRAM', vramGB: 32, price: 0.85, rangeLow: 0.45, rangeHigh: 1.80, availability: 'High', bandwidth: '1.8 TB/s', cpu: 'AMD EPYC 32 vCPU', ram: '128 GB', disk: '1 TB NVMe', description: 'Next-gen consumer GPU with Blackwell architecture for AI and gaming.', sparkData: [40, 42, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20] },
    { name: 'B200', arch: 'Blackwell', vram: '192GB VRAM', vramGB: 192, price: 5.50, rangeLow: 4.00, rangeHigh: 7.00, availability: 'Low', bandwidth: '8.0 TB/s', cpu: 'AMD EPYC 128 vCPU', ram: '1024 GB', disk: '4 TB NVMe', description: 'Next-gen Blackwell enterprise GPU with massive memory for trillion-parameter models.', sparkData: [10, 12, 15, 18, 20, 22, 18, 15, 12, 10, 8, 6] },
    { name: 'L40S', arch: 'Ada Lovelace', vram: '48GB VRAM', vramGB: 48, price: 1.75, rangeLow: 1.20, rangeHigh: 2.80, availability: 'Med', bandwidth: '864 GB/s', cpu: 'AMD EPYC 48 vCPU', ram: '192 GB', disk: '1 TB NVMe', description: 'Universal GPU for AI inference, graphics, and rendering in the data center.', sparkData: [25, 28, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12] },
  ])
  const admin = await User.findOne({ email: 'admin@hamro.ai' })
  if (!admin) {
    await User.create({ name: 'Admin', email: 'admin@hamro.ai', password: 'admin123', balance: 9999, isAdmin: true })
  }
  res.json({ message: 'Seeded 7 GPUs + admin user' })
})

app.use('/api/*', (req, res) => res.status(404).json({ message: 'API route not found' }))

app.use((err, req, res, next) => {
  logger.error({ err: err.message, stack: isProd ? undefined : err.stack })
  res.status(500).json({ message: isProd ? 'Internal server error' : err.message })
})

if (isProd) {
  app.use(express.static(path.join(__dirname, '..', 'dist')))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API route not found' })
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMainModule) {
  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    logger.info({ port: PORT, mode: isProd ? 'production' : 'development' }, 'Server started')
  })

  initSocket(server)
  connectDB()

  setInterval(async () => {
    try {
      const expired = await Order.updateMany(
        { status: 'active', expiresAt: { $lt: new Date() } },
        { $set: { status: 'completed', instanceStatus: 'terminated' } }
      )
      if (expired.modifiedCount > 0) logger.info({ count: expired.modifiedCount }, 'Auto-terminated expired orders')
    } catch (err) {
      logger.error({ err: err.message }, 'Order expiry check failed')
    }
  }, 60000)

  process.on('SIGTERM', () => { logger.info('SIGTERM received. Shutting down...'); server.close(() => process.exit(0)) })
  process.on('SIGINT', () => { logger.info('SIGINT received. Shutting down...'); server.close(() => process.exit(0)) })
}
