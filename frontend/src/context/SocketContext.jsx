import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext.jsx'

const SocketCtx = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const origin = (import.meta.env.VITE_API_URL || 'http://localhost:5000')

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect()
      setSocket(null)
      return
    }
    const s = io(origin, { auth: { userId: user.id } })
    setSocket(s)
    return () => { s.disconnect() }
  }, [user])

  const value = useMemo(() => ({ socket }), [socket])
  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>
}

export function useSocket() { return useContext(SocketCtx) }


