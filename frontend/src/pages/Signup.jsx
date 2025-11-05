import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup(){
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    try{
      await signup(name, email, password)
      nav('/')
    }catch(e){ setErr('Signup failed') }
  }
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded border">
      <h1 className="text-xl font-semibold mb-4">Signup</h1>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded py-2">Create Account</button>
      </form>
      <div className="text-sm mt-3">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
    </div>
  )
}


