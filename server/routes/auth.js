import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import { sendEmail } from '../config/email.js'
import Transaction from '../models/Transaction.js'

const router = express.Router()

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already registered' })

  const user = await User.create({ name, email, password })
  sendEmail({
    to: email,
    subject: 'Welcome to hamro.ai!',
    html: `<h2>Welcome ${name}!</h2><p>Your hamro.ai account is ready. You have <strong>$${user.balance}</strong> credit to start renting GPUs in Nepal.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard">Go to Dashboard →</a></p>`,
  })
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, balance: user.balance,
    token: generateToken(user._id),
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  res.json({
    _id: user._id, name: user.name, email: user.email, balance: user.balance,
    token: generateToken(user._id),
  })
})

router.get('/me', protect, async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, balance: req.user.balance })
})

router.post('/topup', protect, async (req, res) => {
  const { amount } = req.body
  if (!amount || amount < 1) return res.status(400).json({ message: 'Amount must be at least $1' })
  req.user.balance += amount
  await req.user.save()
  await Transaction.create({ user: req.user._id, type: 'topup', amount, description: `Added $${amount} to balance` })
  res.json({ balance: req.user.balance, message: `$${amount} added to your balance` })
})

export default router
