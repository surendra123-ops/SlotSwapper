import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Requests from './pages/Requests.jsx'
import Navbar from './components/Navbar.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen">
          <Navbar />
          <div className="max-w-4xl mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </SocketProvider>
    </AuthProvider>
  )
}


