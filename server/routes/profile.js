import express from 'express'
import authLight from '../middleware/authLight.js'
import User from '../models/User.js'
import logger from '../config/logger.js'

const router = express.Router()

router.get('/', authLight, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email phone avatar').lean()
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

router.put('/', authLight, async (req, res) => {
  const { name, phone } = req.body
  const update = {}
  if (name) update.name = name
  if (phone) update.phone = phone
  if (Object.keys(update).length === 0) return res.status(400).json({ message: 'No fields to update' })
  const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true, runValidators: true })
    .select('name email phone avatar').lean()
  if (!user) return res.status(404).json({ message: 'User not found' })
  logger.info({ userId: req.user.id }, 'Profile updated')
  res.json(user)
})

export default router
