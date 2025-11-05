import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthCtx = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  const api = axios.create({ baseURL: API_URL })
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  useEffect(() => {
    if (!token) return setUser(null)
    api.get('/api/auth/me').then(res => setUser(res.data.user)).catch(() => setUser(null))
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const signup = async (name, email, password) => {
    const { data } = await api.post('/api/auth/signup', { name, email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ token, user, api, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() { return useContext(AuthCtx) }


