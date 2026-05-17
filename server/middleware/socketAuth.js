import jwt from 'jsonwebtoken'

export function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token
  if (!token) return next(new Error('Authentication required'))
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    next()
  } catch {
    next(new Error('Invalid token'))
  }
}
