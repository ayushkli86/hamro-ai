import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import crypto from 'crypto'
import User from '../models/User.js'
import Otp from '../models/Otp.js'
import logger from '../config/logger.js'

const router = express.Router()
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

function sendToken(user, res) {
  const token = generateToken(user._id)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  res.redirect(`${frontendUrl}/auth/callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email || '')}`)
}

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed` }),
  (req, res) => sendToken(req.user, res)
)

router.get('/apple',
  passport.authenticate('apple', { scope: ['name', 'email'], session: false })
)

router.get('/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=apple_auth_failed` }),
  (req, res) => sendToken(req.user, res)
)

router.post('/phone/send-otp', async (req, res) => {
  const { phone } = req.body
  if (!phone || phone.length < 8) return res.status(400).json({ message: 'Valid phone number required' })

  const code = crypto.randomInt(100000, 999999).toString()
  await Otp.deleteMany({ phone })
  await Otp.create({ phone, code, expiresAt: new Date(Date.now() + 5 * 60000) })

  logger.info({ phone, code }, 'OTP sent')
  res.json({ message: 'OTP sent', code: process.env.NODE_ENV === 'production' ? undefined : code })
})

router.post('/phone/verify-otp', async (req, res) => {
  const { phone, code } = req.body
  if (!phone || !code) return res.status(400).json({ message: 'Phone and code required' })

  const otp = await Otp.findOne({ phone, code, verified: false, expiresAt: { $gt: new Date() } })
  if (!otp) return res.status(400).json({ message: 'Invalid or expired OTP' })

  otp.verified = true
  await otp.save()

  let user = await User.findOne({ phone })
  if (!user) {
    user = await User.create({
      name: `User ${phone.slice(-4)}`,
      phone,
      phoneVerified: true,
      authProvider: 'phone',
    })
    logger.info({ userId: user._id, phone }, 'User created via phone OTP')
  } else {
    user.phoneVerified = true
    await user.save()
  }

  const token = generateToken(user._id)
  res.json({ token, userId: user._id, name: user.name })
})

export default router
