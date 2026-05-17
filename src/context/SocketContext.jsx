import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)
const WS = import.meta.env.PROD ? window.location.origin : 'http://localhost:5000'

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [priceAlerts, setPriceAlerts] = useState([])

  useEffect(() => {
    let token
    try { token = JSON.parse(localStorage.getItem('user') || '{}')?.token } catch { token = undefined }
    const s = io(WS, {
      auth: { token },
      transports: import.meta.env.PROD ? ['polling'] : ['websocket', 'polling'],
    })
    setSocket(s)

    s.on('priceUpdate', (data) => {
      setPriceAlerts((prev) => [data, ...prev].slice(0, 10))
    })

    return () => s.disconnect()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, priceAlerts }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
