import express from 'express'
import authLight from '../middleware/authLight.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import logger from '../config/logger.js'

const router = express.Router()

router.post('/verify', authLight, async (req, res) => {
  const { token, amount } = req.body
  try {
    const khaltiRes = await fetch('https://khalti.com/api/v2/payment/verify/', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, amount }),
    })
    const data = await khaltiRes.json()
    if (data.state?.name === 'Completed') {
      const usdAmount = Math.round((amount / 100 / 135) * 100) / 100
      await User.findByIdAndUpdate(req.user.id, { $inc: { balance: usdAmount } })
      await Transaction.create({
        user: req.user.id, type: 'topup', amount: usdAmount,
        description: 'Khalti payment', referenceId: data.idx?.toString(),
      })
      logger.info({ userId: req.user.id, amount: usdAmount }, 'Khalti topup')
      return res.json({ success: true, amount: usdAmount })
    }
    res.status(400).json({ success: false, message: 'Payment not completed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
