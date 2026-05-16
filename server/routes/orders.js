import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Gpu from '../models/Gpu.js'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { orderCreateSchema, instanceActionSchema } from '../config/schemas.js'
import { sendEmail } from '../config/email.js'
import Transaction from '../models/Transaction.js'
import logger from '../config/logger.js'
import { renderInvoice } from '../config/invoice.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const { status, search, sort } = req.query
  const filter = { user: req.user._id }
  if (status && ['active', 'completed', 'cancelled'].includes(status)) filter.status = status
  if (search) filter.gpuName = { $regex: search, $options: 'i' }

  const sortOption = sort === 'oldest' ? 'createdAt' : '-createdAt'
  const orders = await Order.find(filter).sort(sortOption).limit(50).lean().select('gpuName hours cost status instanceStatus region sshHost sshPort sshUser jupyterUrl createdAt')
  res.json(orders)
})

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Rent a GPU
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gpuId: { type: string }
 *               hours: { type: integer, minimum: 1, maximum: 720 }
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Insufficient balance or invalid input
 */
router.post('/', protect, validate(orderCreateSchema), async (req, res) => {
  const { gpuId, hours } = req.validated

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const gpu = await Gpu.findById(gpuId).session(session)
    if (!gpu) { await session.abortTransaction(); return res.status(404).json({ message: 'GPU not found' }) }

    const cost = gpu.price * hours
    const user = await User.findById(req.user._id).session(session)
    if (user.balance < cost) { await session.abortTransaction(); return res.status(400).json({ message: 'Insufficient balance' }) }
    if (gpu.inStock < 1) { await session.abortTransaction(); return res.status(400).json({ message: 'No stock available' }) }

    user.balance -= cost
    gpu.inStock -= 1
    await user.save({ session })
    await gpu.save({ session })

    const sshNum = Math.floor(Math.random() * 9000) + 1000
    const [order] = await Order.create([{
      user: req.user._id, gpu: gpuId, gpuName: gpu.name,
      hours, cost, region: 'nepal',
      expiresAt: new Date(Date.now() + hours * 3600000),
      sshHost: `compute${sshNum}.hamro.ai`,
      sshPort: 22 + Math.floor(Math.random() * 1000),
      sshUser: 'root',
      jupyterUrl: `https://compute${sshNum}.hamro.ai:8888`,
    }], { session })

    await Transaction.create([{ user: req.user._id, type: 'rental', amount: -cost, description: `${gpu.name} — ${hours} hrs`, referenceId: order._id.toString() }], { session })

    await session.commitTransaction()

    sendEmail({
      to: user.email,
      subject: `Order Confirmed — ${gpu.name}`,
      html: `<h2>Order Confirmed</h2><p>You rented <strong>${gpu.name}</strong> for <strong>${hours} hour(s)</strong> at <strong>$${cost.toFixed(2)}</strong>.</p><p>Region: Nepal</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">View in Dashboard →</a></p>`,
    })

    logger.info({ userId: req.user._id, orderId: order._id, gpu: gpu.name, hours, cost }, 'Order created')
    res.status(201).json(order)
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
})

router.patch('/:id/cancel', protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  order.status = 'cancelled'
  await order.save()
  res.json(order)
})

router.patch('/:id/instance', protect, validate(instanceActionSchema), async (req, res) => {
  const { action } = req.validated
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  const actions = { start: 'running', stop: 'stopped', terminate: 'terminated' }
  order.instanceStatus = actions[action]
  await order.save()
  logger.info({ orderId: order._id, action }, 'Instance action')
  res.json(order)
})

router.get('/:id/invoice', async (req, res) => {
  let userId
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.query.token
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      userId = decoded.id
    }
  } catch {}
  if (!userId) return res.status(401).json({ message: 'Not authorized' })
  const order = await Order.findOne({ _id: req.params.id, user: userId }).populate('user', 'name email')
  if (!order) return res.status(404).json({ message: 'Order not found' })

  res.send(renderInvoice(order))
})

export default router
