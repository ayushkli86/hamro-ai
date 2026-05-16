import express from 'express'
import Subscriber from '../models/Subscriber.js'
import { validate } from '../middleware/validate.js'
import { subscribeSchema } from '../config/schemas.js'

const router = express.Router()

router.post('/', validate(subscribeSchema), async (req, res) => {
  const { email } = req.validated
  try {
    await Subscriber.create({ email })
    res.json({ message: 'Subscribed!' })
  } catch {
    res.status(400).json({ message: 'Already subscribed' })
  }
})

export default router
