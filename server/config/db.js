import mongoose from 'mongoose'
import logger from './logger.js'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    logger.warn('MONGO_URI not set — skipping MongoDB connection')
    return
  }
  try {
    mongoose.set('strictQuery', true)

    mongoose.connection.on('connected', () => logger.info('MongoDB connected'))
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
    mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'))
    mongoose.connection.on('error', (err) => logger.error({ err: err.message }, 'MongoDB error'))

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 100,
      minPoolSize: 10,
      heartbeatFrequencyMS: 10000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    })
    logger.info({ host: conn.connection.host }, 'MongoDB connected')
  } catch (error) {
    logger.warn({ err: error.message }, 'MongoDB unavailable — retrying in 5s')
    setTimeout(connectDB, 5000)
  }
}

export default connectDB
