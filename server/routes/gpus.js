import express from 'express'
import Gpu from '../models/Gpu.js'
import { getCached, setCache, clearCache } from '../config/cache.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { search, minPrice, maxPrice, arch, minVram, availability, region, sort, page = 1, limit = 20 } = req.query
  const filter = {}

  const cacheKey = `gpus:${JSON.stringify(req.query)}`
  const cached = getCached(cacheKey)
  if (cached) {
    res.set('Cache-Control', 'public, max-age=30, s-maxage=30')
    res.set('X-Cache', 'HIT')
    return res.json(cached)
  }

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
  const pageSize = Math.min(parseInt(limit), 100)

  const [gpus, total] = await Promise.all([
    Gpu.find(filter).sort(sortOption).skip(skip).limit(pageSize).lean().select('name arch vram vramGB price rangeLow rangeHigh availability inStock bandwidth cpu ram disk description region'),
    Gpu.countDocuments(filter),
  ])

  const result = { gpus, total, page: parseInt(page), pages: Math.ceil(total / pageSize) }
  setCache(cacheKey, result, search ? 5000 : 15000)

  res.set('Cache-Control', 'public, max-age=30, s-maxage=30')
  res.set('X-Cache', 'MISS')
  res.json(result)
})

router.get('/:id', async (req, res) => {
  const gpu = await Gpu.findById(req.params.id).lean()
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  res.set('Cache-Control', 'public, max-age=60, s-maxage=60')
  res.json(gpu)
})

export default router
