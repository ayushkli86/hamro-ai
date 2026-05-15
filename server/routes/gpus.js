import express from 'express'
import Gpu from '../models/Gpu.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const gpus = await Gpu.find({})
  res.json(gpus)
})

router.get('/:id', async (req, res) => {
  const gpu = await Gpu.findById(req.params.id)
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.json(gpu)
})

export default router
