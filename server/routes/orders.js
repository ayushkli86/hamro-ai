import express from 'express'
import jwt from 'jsonwebtoken'
import Order from '../models/Order.js'
import Gpu from '../models/Gpu.js'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import { sendEmail } from '../config/email.js'
import Transaction from '../models/Transaction.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const { status, search, sort } = req.query
  const filter = { user: req.user._id }
  if (status && ['active', 'completed', 'cancelled'].includes(status)) filter.status = status
  if (search) filter.gpuName = { $regex: search, $options: 'i' }

  const sortOption = sort === 'oldest' ? 'createdAt' : '-createdAt'
  const orders = await Order.find(filter).sort(sortOption)
  res.json(orders)
})

router.post('/', protect, async (req, res) => {
  const { gpuId, hours } = req.body
  const gpu = await Gpu.findById(gpuId)
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })

  const cost = gpu.price * hours
  const user = await User.findById(req.user._id)
  if (user.balance < cost) return res.status(400).json({ message: 'Insufficient balance' })

  if (gpu.inStock < 1) return res.status(400).json({ message: 'No stock available' })

  user.balance -= cost
  gpu.inStock -= 1
  await user.save()
  await gpu.save()

  const sshNum = Math.floor(Math.random() * 9000) + 1000
  const order = await Order.create({
    user: req.user._id, gpu: gpuId, gpuName: gpu.name,
    hours, cost, region: 'nepal',
    sshHost: `compute${sshNum}.hamro.ai`,
    sshPort: 22 + Math.floor(Math.random() * 1000),
    sshUser: 'root',
    jupyterUrl: `https://compute${sshNum}.hamro.ai:8888`,
  })

  sendEmail({
    to: user.email,
    subject: `Order Confirmed — ${gpu.name}`,
    html: `<h2>Order Confirmed</h2><p>You rented <strong>${gpu.name}</strong> for <strong>${hours} hour(s)</strong> at <strong>$${cost.toFixed(2)}</strong>.</p><p>Region: Nepal</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard">View in Dashboard →</a></p>`,
  })

  await Transaction.create({ user: req.user._id, type: 'rental', amount: -cost, description: `${gpu.name} — ${hours} hrs`, referenceId: order._id.toString() })

  res.status(201).json(order)
})

router.patch('/:id/cancel', protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  order.status = 'cancelled'
  await order.save()
  res.json(order)
})

router.patch('/:id/instance', protect, async (req, res) => {
  const { action } = req.body
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  const actions = { start: 'running', stop: 'stopped', terminate: 'terminated' }
  if (!actions[action]) return res.status(400).json({ message: 'Invalid action' })
  order.instanceStatus = actions[action]
  await order.save()
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

  const total = order.cost
  const tax = total * 0.13
  const grandTotal = total + tax

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Invoice — hamro.ai</title>
<style>
  body { font-family: 'Courier New', monospace; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
  .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 24px; }
  .header p { margin: 4px 0; color: #666; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
  .total { font-size: 18px; font-weight: bold; margin-top: 16px; padding-top: 16px; border-top: 2px solid #333; }
  .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
  @media print { body { margin: 0; } .no-print { display: none; } }
</style></head>
<body>
  <div class="header">
    <h1>hamro.ai</h1>
    <p>GPU Cloud • Nepal</p>
    <p>Invoice #${order._id.toString().slice(-8).toUpperCase()}</p>
  </div>
  <p><strong>Customer:</strong> ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</p>
  <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <p><strong>Region:</strong> ${order.region}</p>
  <br>
  <div class="row"><span>${order.gpuName} × ${order.hours}h @ $${(order.cost / order.hours).toFixed(2)}/hr</span><span>$${total.toFixed(2)}</span></div>
  <div class="row"><span>Status</span><span>${order.status.toUpperCase()}</span></div>
  <div class="row"><span>Tax (13%)</span><span>$${tax.toFixed(2)}</span></div>
  <div class="row total"><span>Grand Total</span><span>$${grandTotal.toFixed(2)}</span></div>
  <div class="footer"><p>Thank you for using hamro.ai</p><button class="no-print" onclick="window.print()" style="margin-top:12px;padding:8px 20px;cursor:pointer;">Print / Save PDF</button></div>
</body></html>
  `)
})

export default router
