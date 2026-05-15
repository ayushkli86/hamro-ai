import express from 'express'
import ApiKey from '../models/ApiKey.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const keys = await ApiKey.find({ user: req.user._id }).sort('-createdAt').lean().select('name createdAt active')
  res.json(keys)
})

router.post('/', protect, async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })
  const key = await ApiKey.create({ user: req.user._id, name })
  res.status(201).json(key)
})

router.delete('/:id', protect, async (req, res) => {
  const key = await ApiKey.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!key) return res.status(404).json({ message: 'Key not found' })
  res.json({ message: 'Key revoked' })
})

export default router
