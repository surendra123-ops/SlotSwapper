import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    try{
      await login(email, password)
      nav('/')
    }catch(e){ setErr('Invalid credentials') }
  }
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded border">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded py-2">Login</button>
      </form>
      <div className="text-sm mt-3">No account? <Link className="text-blue-600" to="/signup">Signup</Link></div>
    </div>
  )
}


