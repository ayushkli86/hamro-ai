import express from 'express'
import jwt from 'jsonwebtoken'
import Transaction from '../models/Transaction.js'
import authLight from '../middleware/authLight.js'

const router = express.Router()

router.get('/', authLight, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt').lean().select('type amount description createdAt')
  res.json(transactions)
})

const authQuery = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token
  if (!token) return res.status(401).json({ message: 'Not authorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token failed' })
  }
}

router.get('/export', authQuery, async (req, res) => {
  const txns = await Transaction.find({ user: req.user.id }).sort('-createdAt').lean()
  const header = 'Date,Type,Amount,Description,Reference\n'
  const rows = txns.map(t => {
    const date = new Date(t.createdAt).toISOString().split('T')[0]
    const desc = (t.description || '').replace(/"/g, '""')
    return `${date},${t.type},${t.amount},"${desc}",${t.referenceId || ''}`
  }).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
  res.send(header + rows)
})

export default router
