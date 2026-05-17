import jwt from 'jsonwebtoken'
import logger from '../config/logger.js'

export function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token
  if (!token) {
    logger.warn({ ip: socket.handshake.address }, 'WS auth: no token provided')
    return next(new Error('Authentication required'))
  }
  if (!process.env.JWT_SECRET) {
    logger.error('WS auth: JWT_SECRET not set')
    return next(new Error('Authentication error'))
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    next()
  } catch (err) {
    logger.warn({ err: err.message, ip: socket.handshake.address }, 'WS auth: invalid token')
    next(new Error('Invalid token'))
  }
}
