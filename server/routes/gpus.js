import express from 'express'
import Gpu from '../models/Gpu.js'
import ProviderGpu from '../models/ProviderGpu.js'
import { validateQuery } from '../middleware/validate.js'
import { gpuQuerySchema } from '../config/schemas.js'
import { getCached, setCache } from '../config/cache.js'

const router = express.Router()

/**
 * @openapi
 * /api/gpus:
 *   get:
 *     tags: [GPUs]
 *     summary: List available GPUs with filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: string }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: string }
 *       - in: query
 *         name: arch
 *         schema: { type: string }
 *       - in: query
 *         name: minVram
 *         schema: { type: string }
 *       - in: query
 *         name: availability
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: string, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: string, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated GPU list
 */
router.get('/', validateQuery(gpuQuerySchema), async (req, res) => {
  const { search, minPrice, maxPrice, arch, minVram, availability, region, sort, page = 1, limit = 20 } = req.query
  const filter = {}

  const cacheKey = `gpus:${JSON.stringify(req.query)}`
  const cached = await getCached(cacheKey)
  if (cached) {
    res.set('Cache-Control', 'public, max-age=30, s-maxage=30')
    res.set('X-Cache', 'HIT')
    return res.json(cached)
  }

  if (search) {
    if (search.length >= 2) {
      filter.$text = { $search: search }
    } else {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { arch: { $regex: search, $options: 'i' } },
      ]
    }
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

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const pageSize = Math.min(parseInt(limit), 100)

  let projection = 'name arch vram vramGB price rangeLow rangeHigh availability inStock bandwidth cpu ram disk description region'
  let sortOption = sort === 'price_asc' ? 'price' : sort === 'price_desc' ? '-price' : sort === 'name' ? 'name' : sort === 'vram' ? '-vramGB' : '-createdAt'

  if (filter.$text) {
    projection = { name: 1, arch: 1, vram: 1, vramGB: 1, price: 1, rangeLow: 1, rangeHigh: 1, availability: 1, inStock: 1, bandwidth: 1, cpu: 1, ram: 1, disk: 1, description: 1, region: 1, score: { $meta: 'textScore' } }
    if (!sort || sort === 'newest') sortOption = { score: { $meta: 'textScore' } }
  }

  const [gpus, total] = await Promise.all([
    Gpu.find(filter).sort(sortOption).skip(skip).limit(pageSize).lean().select(projection),
    Gpu.countDocuments(filter),
  ])

  const providerFilter = { isOnline: true, isAvailable: true }
  if (search) providerFilter.gpuName = { $regex: search, $options: 'i' }
  if (minVram) providerFilter.gpuMemory = { $gte: parseInt(minVram) }
  const providerGpus = await ProviderGpu.find(providerFilter)
    .sort({ pricePerHour: 1 }).limit(20).lean()

  const providerMapped = providerGpus.map(g => ({
    _id: g._id,
    name: g.gpuName,
    vram: `${g.gpuMemory}GB`,
    vramGB: g.gpuMemory,
    price: g.pricePerHour,
    provider: g.user,
    source: 'provider',
    isOnline: g.isOnline,
    region: g.region,
  }))

  const result = { gpus, providerGpus: providerMapped, total, page: parseInt(page), pages: Math.ceil(total / pageSize) }
  await setCache(cacheKey, result, search ? 5000 : 15000)

  res.set('Cache-Control', 'public, max-age=30, s-maxage=30')
  res.set('X-Cache', 'MISS')
  res.json(result)
})

router.get('/:id', async (req, res) => {
  const cacheKey = `gpu:${req.params.id}`
  const cached = await getCached(cacheKey)
  if (cached) {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60')
    res.set('X-Cache', 'HIT')
    return res.json(cached)
  }

  const gpu = await Gpu.findById(req.params.id).lean()
  if (!gpu) return res.status(404).json({ message: 'GPU not found' })
  await setCache(cacheKey, gpu, 60000)

  res.set('Cache-Control', 'public, max-age=60, s-maxage=60')
  res.set('X-Cache', 'MISS')
  res.json(gpu)
})

export default router
