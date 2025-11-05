import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'

export default function Requests(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])

  const load = async ()=>{
    const { data } = await api.get('/api/requests')
    setIncoming(data.incoming)
    setOutgoing(data.outgoing)
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{
    if(!socket) return
    const refresh = ()=> load()
    socket.on('swap:requested', refresh)
    socket.on('swap:accepted', refresh)
    socket.on('swap:rejected', refresh)
    return ()=>{
      socket.off('swap:requested', refresh)
      socket.off('swap:accepted', refresh)
      socket.off('swap:rejected', refresh)
    }
  },[socket])

  const respond = async (id, accepted)=>{
    await api.post(`/api/swap-response/${id}`, { accepted })
    load()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">Incoming</h2>
        <div className="space-y-2">
          {incoming.map(r=> (
            <div key={r._id} className="bg-white border rounded p-3 flex items-center justify-between">
              <div>
                <div className="text-sm">Request from <span className="font-medium">{r.requesterId}</span></div>
                <div className="text-xs text-gray-600">Status: {r.status}</div>
              </div>
              {r.status==='PENDING' && (
                <div className="flex gap-2">
                  <button onClick={()=>respond(r._id, true)} className="px-2 py-1 text-sm bg-emerald-600 text-white rounded">Accept</button>
                  <button onClick={()=>respond(r._id, false)} className="px-2 py-1 text-sm border rounded">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Outgoing</h2>
        <div className="space-y-2">
          {outgoing.map(r=> (
            <div key={r._id} className="bg-white border rounded p-3 flex items-center justify-between">
              <div>
                <div className="text-sm">To <span className="font-medium">{r.receiverId}</span></div>
                <div className="text-xs text-gray-600">Status: {r.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


