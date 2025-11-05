import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const loc = useLocation()
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">SlotSwapper</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link className={linkCls(loc, '/')} to="/">Dashboard</Link>
            <Link className={linkCls(loc, '/market')} to="/market">Marketplace</Link>
            <Link className={linkCls(loc, '/requests')} to="/requests">Requests</Link>
            <span className="text-sm text-gray-600">{user.name}</span>
            <button onClick={logout} className="px-3 py-1 rounded bg-gray-900 text-white text-sm">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function linkCls(loc, path) {
  const active = loc.pathname === path
  return active ? 'text-blue-600 font-medium' : 'text-gray-700'
}


