import express from 'express'
import Transaction from '../models/Transaction.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort('-createdAt')
  res.json(transactions)
})

export default router
