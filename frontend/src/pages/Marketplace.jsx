import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import SwapModal from '../components/SwapModal.jsx'

export default function Marketplace(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [slots, setSlots] = useState([])
  const [mine, setMine] = useState([])
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState(null)

  const load = async ()=>{
    const [{ data: market }, { data: me }] = await Promise.all([
      api.get('/api/swappable-slots'),
      api.get('/api/events')
    ])
    setSlots(market.events)
    setMine(me.events.filter(e=>e.status==='SWAPPABLE'))
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{
    if(!socket) return
    const refresh = ()=> load()
    socket.on('swap:accepted', refresh)
    socket.on('swap:rejected', refresh)
    return ()=>{
      socket.off('swap:accepted', refresh)
      socket.off('swap:rejected', refresh)
    }
  },[socket])

  const request = async (mySlotId)=>{
    await api.post('/api/swap-request', { mySlotId, theirSlotId: target._id })
    setOpen(false)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Marketplace</h1>
      <div className="space-y-3">
        {slots.map(e=> (
          <div key={e._id} className="bg-white border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-600">{new Date(e.startTime).toLocaleString()} - {new Date(e.endTime).toLocaleString()}</div>
            </div>
            <button onClick={()=>{setTarget(e); setOpen(true)}} className="px-3 py-1.5 bg-emerald-600 text-white rounded">Request Swap</button>
          </div>
        ))}
      </div>
      <SwapModal open={open} onClose={()=>setOpen(false)} mySwappable={mine} onSubmit={request} targetSlot={target} />
    </div>
  )
}


