import express from 'express'
import Transaction from '../models/Transaction.js'
import protect from '../middleware/auth.js'
import authLight from '../middleware/authLight.js'

const router = express.Router()

router.get('/', authLight, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt').lean().select('type amount description createdAt')
  res.json(transactions)
})

export default router
