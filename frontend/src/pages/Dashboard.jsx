import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import EventForm from '../components/EventForm.jsx'
import EventList from '../components/EventList.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'

export default function Dashboard(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/events')
      setEvents(data.events)
    } catch (err) {
      setToast({ message: 'Failed to load events', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{
    if(!socket) return
    const refresh = ()=> {
      setToast({ message: 'Calendar updated!', type: 'info' })
      load()
    }
    socket.on('swap:requested', refresh)
    socket.on('swap:accepted', refresh)
    socket.on('swap:rejected', refresh)
    return ()=>{
      socket.off('swap:requested', refresh)
      socket.off('swap:accepted', refresh)
      socket.off('swap:rejected', refresh)
    }
  },[socket])

  const create = async (payload)=>{
    try {
      setActionLoading(true)
      await api.post('/api/events', payload)
      setToast({ message: 'Event created successfully!', type: 'success' })
      await load()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create event', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const update = async (payload)=>{
    try {
      setActionLoading(true)
      await api.put(`/api/events/${editing._id}`, payload)
      setEditing(null)
      setToast({ message: 'Event updated successfully!', type: 'success' })
      await load()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update event', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const del = async (e)=>{
    if (!confirm(`Delete "${e.title}"?`)) return
    try {
      setActionLoading(true)
      await api.delete(`/api/events/${e._id}`)
      setToast({ message: 'Event deleted successfully!', type: 'success' })
      await load()
    } catch (err) {
      setToast({ message: 'Failed to delete event', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const makeSwappable = async (e)=>{
    try {
      setActionLoading(true)
      await api.put(`/api/events/${e._id}`, { status: 'SWAPPABLE' })
      setToast({ message: 'Event is now swappable!', type: 'success' })
      await load()
    } catch (err) {
      setToast({ message: 'Failed to update event', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">📅 My Calendar</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your events and mark them as swappable</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {editing ? '✏️ Edit Event' : '➕ Create New Event'}
          </h2>
          {editing && (
            <button 
              onClick={() => setEditing(null)} 
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded hover:bg-gray-100 self-start sm:self-auto"
            >
              Cancel
            </button>
          )}
        </div>
        <EventForm onSubmit={editing ? update : create} initial={editing} loading={actionLoading} />
      </div>

      {loading ? (
        <div className="bg-white border rounded-lg p-8 sm:p-12 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading your events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-4">📭</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No events yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Start by creating your first event above!</p>
          <p className="text-xs sm:text-sm text-gray-500">Mark events as "SWAPPABLE" to let others request swaps</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Your Events ({events.length})
            </h3>
            <div className="text-xs sm:text-sm text-gray-600">
              {events.filter(e => e.status === 'SWAPPABLE').length} swappable
            </div>
          </div>
          <EventList events={events} onEdit={setEditing} onDelete={del} onMakeSwappable={makeSwappable} />
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}


