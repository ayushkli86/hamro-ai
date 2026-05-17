import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import authLight from '../middleware/authLight.js'
import { validate } from '../middleware/validate.js'
import { signupSchema, loginSchema, topupSchema, passwordChangeSchema } from '../config/schemas.js'
import { enqueueEmail } from '../config/queue.js'
import Transaction from '../models/Transaction.js'
import logger from '../config/logger.js'

const router = express.Router()

const generateToken = (user) => jwt.sign(
  { id: user._id || user.id, name: user.name, email: user.email, balance: user.balance, isAdmin: user.isAdmin || false, emailVerified: user.emailVerified || false },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
)

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post('/signup', validate(signupSchema), async (req, res) => {
  const { name, email, password } = req.validated
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already registered' })

  const verificationToken = crypto.randomBytes(32).toString('hex')
  const user = await User.create({ name, email, password, verificationToken, verificationTokenExpires: Date.now() + 24 * 3600000 })

  enqueueEmail({
    to: email,
    subject: 'Welcome to hamro.ai!',
    html: `<h2>Welcome ${name}!</h2><p>Your hamro.ai account is ready. You have <strong>$${user.balance}</strong> credit to start renting GPUs in Nepal.</p><p>Please verify your email: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}">Verify Email →</a></p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">Go to Dashboard →</a></p>`,
  })
  logger.info({ userId: user._id }, 'User signed up')
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, balance: user.balance,
    token: generateToken(user),
  })
})

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Returns JWT token
 *       401:
 *         description: Invalid credentials
 */
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
    token: generateToken(user),
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
  enqueueEmail({
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

router.get('/me', authLight, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email balance avatar phone emailVerified').lean()
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ ...user, _id: user._id })
})

router.post('/topup', authLight, validate(topupSchema), async (req, res) => {
  const { amount } = req.validated
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { balance: amount } },
    { new: true, select: 'balance' }
  )
  if (!user) return res.status(404).json({ message: 'User not found' })
  await Transaction.create({ user: req.user.id, type: 'topup', amount, description: `Added $${amount} to balance` })
  logger.info({ userId: req.user.id, amount }, 'Balance topped up')
  res.json({ balance: user.balance, message: `$${amount} added to your balance` })
})

router.post('/refresh', authLight, async (req, res) => {
  const token = generateToken(req.user)
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
