import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { signupSchema, loginSchema, topupSchema, passwordChangeSchema } from '../config/schemas.js'
import { sendEmail } from '../config/email.js'
import Transaction from '../models/Transaction.js'
import logger from '../config/logger.js'

const router = express.Router()

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

router.post('/signup', validate(signupSchema), async (req, res) => {
  const { name, email, password } = req.validated
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already registered' })

  const verificationToken = crypto.randomBytes(32).toString('hex')
  const user = await User.create({ name, email, password, verificationToken, verificationTokenExpires: Date.now() + 24 * 3600000 })

  sendEmail({
    to: email,
    subject: 'Welcome to hamro.ai!',
    html: `<h2>Welcome ${name}!</h2><p>Your hamro.ai account is ready. You have <strong>$${user.balance}</strong> credit to start renting GPUs in Nepal.</p><p>Please verify your email: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}">Verify Email →</a></p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">Go to Dashboard →</a></p>`,
  })
  logger.info({ userId: user._id }, 'User signed up')
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, balance: user.balance,
    token: generateToken(user._id),
  })
})

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid email or password' })
  if (user.isLocked()) return res.status(423).json({ message: 'Account locked. Try again in 15 minutes.' })
  if (!(await user.matchPassword(password))) {
    await user.incrementLoginAttempts()
    logger.warn({ email }, 'Failed login attempt')
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  await user.resetLoginAttempts()
  logger.info({ userId: user._id }, 'User logged in')
  res.json({
    _id: user._id, name: user.name, email: user.email, balance: user.balance,
    token: generateToken(user._id),
  })
})

router.get('/verify-email/:token', async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token, verificationTokenExpires: { $gt: Date.now() } })
  if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' })
  user.emailVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save()
  res.json({ message: 'Email verified' })
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email required' })
  const user = await User.findOne({ email })
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' })
  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = resetToken
  user.resetPasswordExpires = Date.now() + 3600000
  await user.save()
  sendEmail({
    to: email,
    subject: 'Password Reset — hamro.ai',
    html: `<h2>Password Reset</h2><p>Click to reset: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}">Reset Password →</a></p><p>Link expires in 1 hour.</p>`,
  })
  res.json({ message: 'If that email exists, a reset link has been sent' })
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password || password.length < 6) return res.status(400).json({ message: 'Invalid request' })
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' })
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()
  res.json({ message: 'Password reset successful' })
})

router.get('/me', protect, async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, balance: req.user.balance, emailVerified: req.user.emailVerified })
})

router.post('/topup', protect, validate(topupSchema), async (req, res) => {
  const { amount } = req.validated
  req.user.balance += amount
  await req.user.save()
  await Transaction.create({ user: req.user._id, type: 'topup', amount, description: `Added $${amount} to balance` })
  logger.info({ userId: req.user._id, amount }, 'Balance topped up')
  res.json({ balance: req.user.balance, message: `$${amount} added to your balance` })
})

router.post('/refresh', protect, async (req, res) => {
  const token = generateToken(req.user._id)
  res.json({ token })
})

router.put('/password', protect, validate(passwordChangeSchema), async (req, res) => {
  const { currentPassword, newPassword } = req.validated
  if (!(await req.user.matchPassword(currentPassword))) return res.status(401).json({ message: 'Current password is incorrect' })
  req.user.password = newPassword
  await req.user.save()
  res.json({ message: 'Password updated' })
})

export default router
