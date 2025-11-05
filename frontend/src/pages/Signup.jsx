import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function Signup(){
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  
  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    
    // Validation
    if (!name.trim()) {
      setErr('Please enter your full name')
      return
    }
    if (name.trim().length < 2) {
      setErr('Name must be at least 2 characters long')
      return
    }
    if (!email.trim()) {
      setErr('Please enter your email address')
      return
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErr('Please enter a valid email address')
      return
    }
    if (!password.trim()) {
      setErr('Please enter a password')
      return
    }
    if (password.length < 6) {
      setErr('Password must be at least 6 characters long')
      return
    }
    
    try{
      setLoading(true)
      await signup(name, email, password)
      nav('/')
    }catch(e){ 
      setErr(e.response?.data?.message || 'Signup failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-10 bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ Create Account</h1>
        <p className="text-gray-600">Join SlotSwapper to start swapping time slots</p>
      </div>
      
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          <span className="font-medium">⚠️ Error:</span> {err}
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-2">
            👤 Full Name <span className="text-red-500">*</span>
          </label>
          <input 
            id="signup-name"
            type="text"
            className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
            placeholder="Enter your full name"
            value={name} 
            onChange={e=>setName(e.target.value)}
            required
            disabled={loading}
            minLength={2}
          />
          <p className="text-xs text-gray-500 mt-1.5">This name will be visible to other users when swapping</p>
        </div>
        
        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
            📧 Email Address <span className="text-red-500">*</span>
          </label>
          <input 
            id="signup-email"
            type="email"
            className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
            placeholder="Enter your email address"
            value={email} 
            onChange={e=>setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1.5">We'll use this email to log you in. It must be unique.</p>
        </div>
        
        <div>
          <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
            🔑 Password <span className="text-red-500">*</span>
          </label>
          <input 
            id="signup-password"
            type="password" 
            className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
            placeholder="Create a secure password"
            value={password} 
            onChange={e=>setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1.5">Password must be at least 6 characters long</p>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 sm:py-2.5 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 text-base sm:text-sm"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>✨ Create Account</span>
          )}
        </button>
      </form>
      
      <div className="text-center text-sm mt-6 pt-6 border-t border-gray-200">
        <span className="text-gray-600">Already have an account? </span>
        <Link className="text-blue-600 font-medium hover:text-blue-700 hover:underline" to="/login">
          Sign In →
        </Link>
      </div>
    </div>
  )
}


