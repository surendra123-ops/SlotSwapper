import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import EventForm from '../components/EventForm.jsx'
import EventList from '../components/EventList.jsx'

export default function Dashboard(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const { data } = await api.get('/api/events')
    setEvents(data.events)
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

  const create = async (payload)=>{ await api.post('/api/events', payload); load() }
  const update = async (payload)=>{ await api.put(`/api/events/${editing._id}`, payload); setEditing(null); load() }
  const del = async (e)=>{ await api.delete(`/api/events/${e._id}`); load() }
  const makeSwappable = async (e)=>{ await api.put(`/api/events/${e._id}`, { status: 'SWAPPABLE' }); load() }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Calendar</h1>
      <div className="bg-white border rounded p-4 mb-6">
        <h2 className="font-medium mb-2">{editing ? 'Edit Event' : 'Create Event'}</h2>
        <EventForm onSubmit={editing ? update : create} initial={editing} />
      </div>
      <EventList events={events} onEdit={setEditing} onDelete={del} onMakeSwappable={makeSwappable} />
    </div>
  )
}


