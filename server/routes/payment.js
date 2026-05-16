import express from 'express'
import protect from '../middleware/auth.js'
import Coupon from '../models/Coupon.js'

const router = express.Router()

router.post('/verify', protect, async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ message: 'Coupon code required' })
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true })
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' })
  if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon max uses reached' })
  res.json({ code: coupon.code, discountPercent: coupon.discountPercent, discountAmount: coupon.discountAmount })
})

export default router
