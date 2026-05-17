import express from 'express'
import authLight from '../middleware/authLight.js'
import User from '../models/User.js'
import logger from '../config/logger.js'

const router = express.Router()

router.get('/', authLight, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email phone avatar').lean()
  res.json(user)
})

router.put('/', authLight, async (req, res) => {
  const { name, phone } = req.body
  const update = {}
  if (name) update.name = name
  if (phone) update.phone = phone
  const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true, runValidators: true })
    .select('name email phone avatar').lean()
  logger.info({ userId: req.user.id }, 'Profile updated')
  res.json(user)
})

export default router
