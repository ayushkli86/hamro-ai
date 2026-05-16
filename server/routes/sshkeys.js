import express from 'express'
import SshKey from '../models/SshKey.js'
import protect from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { sshKeySchema } from '../config/schemas.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const keys = await SshKey.find({ user: req.user._id }).sort('-createdAt').lean().select('name fingerprint createdAt')
  res.json(keys)
})

router.post('/', protect, validate(sshKeySchema), async (req, res) => {
  const { name, publicKey } = req.validated
  const key = await SshKey.create({ user: req.user._id, name, publicKey })
  res.status(201).json(key)
})

router.delete('/:id', protect, async (req, res) => {
  const key = await SshKey.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!key) return res.status(404).json({ message: 'Key not found' })
  res.json({ message: 'Key removed' })
})

export default router
