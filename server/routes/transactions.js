import express from 'express'
import Transaction from '../models/Transaction.js'
import protect from '../middleware/auth.js'
import authLight from '../middleware/authLight.js'

const router = express.Router()

router.get('/', authLight, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt').lean().select('type amount description createdAt')
  res.json(transactions)
})

router.get('/export', authLight, async (req, res) => {
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
