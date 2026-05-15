import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set — skipping MongoDB connection')
    return
  }
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`⚠️  MongoDB unavailable: ${error.message}`)
    console.warn('   The API will still serve, but database features will be limited')
  }
}

export default connectDB
