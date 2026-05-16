import express from 'express'
import protect from '../middleware/auth.js'
import { createCheckoutSession, constructWebhookEvent } from '../config/stripe.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import logger from '../config/logger.js'

const router = express.Router()

router.post('/create-checkout-session', protect, async (req, res) => {
  const { amount } = req.body
  if (!amount || amount < 1 || amount > 10000) return res.status(400).json({ message: 'Amount must be between $1 and $10,000' })

  const session = await createCheckoutSession(amount, req.user._id, req.user.email)
  if (!session) return res.status(503).json({ message: 'Payment service unavailable' })

  res.json({ url: session.url, sessionId: session.id })
})

export default router
