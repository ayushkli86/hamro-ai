import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'ioredis'
import Gpu from '../models/Gpu.js'
import logger from './logger.js'
import { socketAuth } from '../middleware/socketAuth.js'

let io

export function initSocket(server) {
  const isCpanel = process.env.CPANEL === 'true'
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || (isCpanel ? '*' : 'http://localhost:5173'), methods: ['GET', 'POST'] },
    transports: isCpanel ? ['polling'] : ['websocket', 'polling'],
  })

  if (process.env.CPANEL !== 'true') io.use(socketAuth)

  if (process.env.REDIS_URL) {
    const pub = createClient(process.env.REDIS_URL)
    const sub = createClient(process.env.REDIS_URL)
    io.adapter(createAdapter(pub, sub))
    logger.info('Socket.io using Redis adapter')
  } else {
    logger.warn('REDIS_URL not set — socket.io events limited to single worker')
  }

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'WS client connected')
    socket.on('disconnect', () => logger.info({ socketId: socket.id }, 'WS client disconnected'))
  })

  startPriceSimulator()
  return io
}

async function startPriceSimulator() {
  const simulate = async () => {
    try {
      const gpus = await Gpu.find({}).select('name price').lean()
      if (gpus.length === 0) return
      const gpu = gpus[Math.floor(Math.random() * gpus.length)]
      const change = (Math.random() * 0.2 - 0.1)
      const direction = change >= 0 ? 'up' : 'down'
      io.emit('priceUpdate', { name: gpu.name, change: Math.abs(change), direction })
    } catch (err) {
      logger.error({ err: err.message }, 'Price simulator error')
    }
  }
  setInterval(simulate, 4000)
}

export function getIO() {
  return io
}
