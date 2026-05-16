import express from 'express'
import { authenticator } from '@otplib/preset-default'
import qrcode from 'qrcode'
import protect from '../middleware/auth.js'
import logger from '../config/logger.js'

const router = express.Router()

router.post('/setup', protect, async (req, res) => {
  if (req.user.twoFactorEnabled) return res.status(400).json({ message: '2FA already enabled' })

  const secret = authenticator.generateSecret()
  const label = req.user.email || req.user.phone || req.user._id.toString()
  const otpauth = `otpauth://totp/hamro.ai:${encodeURIComponent(label)}?secret=${secret}&issuer=hamro.ai`

  req.user.twoFactorSecret = secret
  await req.user.save()

  const qr = await qrcode.toDataURL(otpauth)
  res.json({ secret, qr, message: 'Scan the QR code with your authenticator app' })
})

router.post('/verify', protect, async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ message: 'Token required' })
  if (!req.user.twoFactorSecret) return res.status(400).json({ message: '2FA not set up. Call /setup first.' })

  const isValid = authenticator.verify({ token, secret: req.user.twoFactorSecret })
  if (!isValid) return res.status(400).json({ message: 'Invalid token' })

  req.user.twoFactorEnabled = true
  await req.user.save()
  logger.info({ userId: req.user._id }, '2FA enabled')
  res.json({ message: '2FA enabled successfully' })
})

router.post('/disable', protect, async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ message: 'Token required' })
  if (!req.user.twoFactorSecret) return res.status(400).json({ message: '2FA not configured' })

  const isValid = authenticator.verify({ token, secret: req.user.twoFactorSecret })
  if (!isValid) return res.status(400).json({ message: 'Invalid token' })

  req.user.twoFactorEnabled = false
  req.user.twoFactorSecret = undefined
  await req.user.save()
  logger.info({ userId: req.user._id }, '2FA disabled')
  res.json({ message: '2FA disabled' })
})

router.get('/status', protect, async (req, res) => {
  res.json({ enabled: req.user.twoFactorEnabled || false })
})

export default router
