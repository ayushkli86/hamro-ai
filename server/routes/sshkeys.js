import express from 'express'
import SshKey from '../models/SshKey.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const keys = await SshKey.find({ user: req.user._id }).sort('-createdAt')
  res.json(keys)
})

router.post('/', protect, async (req, res) => {
  const { name, publicKey } = req.body
  if (!name || !publicKey) return res.status(400).json({ message: 'Name and public key are required' })
  const key = await SshKey.create({ user: req.user._id, name, publicKey })
  res.status(201).json(key)
})

router.delete('/:id', protect, async (req, res) => {
  const key = await SshKey.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!key) return res.status(404).json({ message: 'Key not found' })
  res.json({ message: 'Key removed' })
})

export default router
