import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn('MONGO_URI not set — skipping MongoDB connection')
    return
  }
  try {
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 100,
      minPoolSize: 10,
      heartbeatFrequencyMS: 10000,
      connectTimeoutMS: 10000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`)
  }
}

export default connectDB
