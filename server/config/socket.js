import { Server } from 'socket.io'

let io

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  io.on('connection', (socket) => {
    console.log('WS client connected:', socket.id)
    socket.on('disconnect', () => console.log('WS client disconnected:', socket.id))
  })

  startPriceSimulator()
  return io
}

function startPriceSimulator() {
  setInterval(() => {
    const gpus = ['RTX PRO 6000 S', 'RTX 4090', 'H100', 'A100', 'RTX 5090']
    const gpu = gpus[Math.floor(Math.random() * gpus.length)]
    const change = (Math.random() * 0.2 - 0.1)
    const direction = change >= 0 ? 'up' : 'down'
    io.emit('priceUpdate', { name: gpu, change: Math.abs(change), direction })
  }, 4000)
}

export function getIO() {
  return io
}
