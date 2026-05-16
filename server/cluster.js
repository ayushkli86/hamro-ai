import cluster from 'cluster'
import os from 'os'
import logger from './config/logger.js'

const numWorkers = parseInt(process.env.WORKERS, 10) || os.cpus().length
const PORT = parseInt(process.env.PORT, 10) || 5000

if (cluster.isPrimary) {
  logger.info({ workers: numWorkers, port: PORT }, 'Master process starting')

  for (let i = 0; i < numWorkers; i++) cluster.fork()

  cluster.on('exit', (worker, code, signal) => {
    logger.warn({ pid: worker.process.pid, code, signal }, 'Worker died — restarting')
    cluster.fork()
  })

  cluster.on('online', (worker) => {
    logger.info({ pid: worker.process.pid, id: worker.id }, 'Worker online')
  })

  const shutdown = () => {
    logger.info('Master shutting down workers...')
    for (const id in cluster.workers) cluster.workers[id].kill('SIGTERM')
    process.exit(0)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
} else {
  const { app } = await import('./server.js')
  const { initSocket } = await import('./config/socket.js')
  const connectDB = (await import('./config/db.js')).default
  const Order = (await import('./models/Order.js')).default

  await connectDB()

  const server = app.listen(PORT)

  server.on('listening', () => {
    logger.info({ port: PORT, pid: process.pid }, 'Worker started')
    initSocket(server)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn({ pid: process.pid }, 'Port in use, retrying...')
      setTimeout(() => server.close(() => app.listen(PORT)), 200)
    } else {
      logger.error({ err: err.message }, 'Server error')
    }
  })

  setInterval(async () => {
    try {
      const expired = await Order.updateMany(
        { status: 'active', expiresAt: { $lt: new Date() } },
        { $set: { status: 'completed', instanceStatus: 'terminated' } }
      )
      if (expired.modifiedCount > 0) logger.info({ count: expired.modifiedCount }, 'Auto-terminated expired orders')
    } catch (err) {
      logger.error({ err: err.message }, 'Order expiry check failed')
    }
  }, 60000)

  process.on('SIGTERM', () => { logger.info('Worker SIGTERM'); server.close(() => process.exit(0)) })
  process.on('SIGINT', () => { logger.info('Worker SIGINT'); server.close(() => process.exit(0)) })
}
