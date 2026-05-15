import express from 'express'
import Subscriber from '../models/Subscriber.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { email } = req.body
  if (!email || !/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'Valid email required' })
  try {
    await Subscriber.create({ email })
    res.json({ message: 'Subscribed!' })
  } catch {
    res.status(400).json({ message: 'Already subscribed' })
  }
})

export default router
