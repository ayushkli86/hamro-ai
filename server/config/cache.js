import Redis from 'ioredis'
import logger from './logger.js'

const DEFAULT_TTL = 30 * 1000

let redis = null
let fallbackCache = new Map()

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 100, 3000),
    lazyConnect: true,
  })
  redis.on('error', (err) => {
    logger.warn({ err: err.message }, 'Redis unavailable — using in-memory cache')
    redis = null
  })
}

export async function getCached(key) {
  if (redis) {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch { return null }
  }
  const entry = fallbackCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) { fallbackCache.delete(key); return null }
  return entry.data
}

export async function setCache(key, data, ttl = DEFAULT_TTL) {
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(data), 'PX', ttl)
      return
    } catch {}
  }
  fallbackCache.set(key, { data, expiry: Date.now() + ttl })
}

export function clearCache(pattern) {
  if (redis) {
    // Pattern deletion would need SCAN + DEL — skip for now, use TTL
    return
  }
  if (!pattern) { fallbackCache.clear(); return }
  for (const key of fallbackCache.keys()) {
    if (key.startsWith(pattern)) fallbackCache.delete(key)
  }
}
