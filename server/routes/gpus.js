import express from 'express'
import Gpu from '../models/Gpu.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { search, minPrice, maxPrice, arch, minVram, availability, region, sort, page = 1, limit = 20 } = req.query
  const filter = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { arch: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = parseFloat(minPrice)
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
  }
  if (arch) filter.arch = arch
  if (minVram) filter.vramGB = { $gte: parseInt(minVram) }
  if (availability) filter.availability = availability
  if (region) filter.region = region

  const sortOption = sort === 'price_asc' ? 'price' : sort === 'price_desc' ? '-price' : sort === 'name' ? 'name' : sort === 'vram' ? '-vramGB' : '-createdAt'
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const [gpus, total] = await Promise.all([
    Gpu.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)),
    Gpu.countDocuments(filter),
  ])

  res.json({ gpus, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
})

router.get('/:id', async (req, res) => {
  const gpu = await Gpu.findById(req.params.id)
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.json(gpu)
})

export default router
