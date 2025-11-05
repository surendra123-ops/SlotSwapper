import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import SwapModal from '../components/SwapModal.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'

export default function Marketplace(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [slots, setSlots] = useState([])
  const [mine, setMine] = useState([])
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async ()=>{
    try {
      setLoading(true)
      const [{ data: market }, { data: me }] = await Promise.all([
        api.get('/api/swappable-slots'),
        api.get('/api/events')
      ])
      setSlots(market.events)
      setMine(me.events.filter(e=>e.status==='SWAPPABLE'))
    } catch (err) {
      setToast({ message: 'Failed to load marketplace', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{
    if(!socket) return
    const refresh = ()=> {
      setToast({ message: 'Marketplace updated!', type: 'info' })
      load()
    }
    const refreshOnDelete = ()=> {
      load()
    }
    const refreshOnUpdate = ()=> {
      load()
    }
    const refreshOnCreate = ()=> {
      load()
    }
    // Listen for swap events
    socket.on('swap:accepted', refresh)
    socket.on('swap:rejected', refresh)
    socket.on('swap:requested', refresh) // When swap is requested, slots become SWAP_PENDING and should disappear
    // Listen for event changes
    socket.on('event:deleted', refreshOnDelete)
    socket.on('event:updated', refreshOnUpdate) // When event status changes (affects marketplace visibility)
    socket.on('event:created', refreshOnCreate) // When new SWAPPABLE event is created
    return ()=>{
      socket.off('swap:accepted', refresh)
      socket.off('swap:rejected', refresh)
      socket.off('swap:requested', refresh)
      socket.off('event:deleted', refreshOnDelete)
      socket.off('event:updated', refreshOnUpdate)
      socket.off('event:created', refreshOnCreate)
    }
  },[socket])

  const request = async (mySlotId)=>{
    try {
      setRequesting(true)
      await api.post('/api/swap-request', { mySlotId, theirSlotId: target._id })
      setOpen(false)
      setTarget(null)
      setToast({ message: 'Swap request sent successfully!', type: 'success' })
      setTimeout(() => load(), 500)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create swap request', type: 'error' })
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🛒 Marketplace</h1>
        <p className="text-sm sm:text-base text-gray-600">Browse available swappable slots from other users</p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading marketplace...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No swappable slots available</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Check back later or create your own swappable events!</p>
          <p className="text-xs sm:text-sm text-gray-500">Go to Dashboard → Create an event → Mark as "SWAPPABLE"</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{slots.length}</span> swappable {slots.length === 1 ? 'slot' : 'slots'}
            </p>
            {mine.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                ⚠️ You need at least one SWAPPABLE event to request swaps
              </p>
            )}
          </div>
          <div className="space-y-4">
            {slots.map(e=> (
              <div key={e._id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{e.title}</h4>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start sm:self-auto">
                        🔄 SWAPPABLE
                      </span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-3 break-words">
                      <div>
                        <span className="font-medium">📅 Start:</span> <span className="break-all">{new Date(e.startTime).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">📅 End:</span> <span className="break-all">{new Date(e.endTime).toLocaleString()}</span>
                      </div>
                    </div>
                    {e.userId && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <span className="text-gray-500">Offered by:</span>
                        <span className="font-medium text-gray-900 truncate">{e.userId.name || e.userId.email || 'Unknown'}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={()=>{setTarget(e); setOpen(true)}} 
                    disabled={mine.length === 0}
                    className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-0"
                  >
                    {mine.length === 0 ? 'No swappable slots' : '🔄 Request Swap'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <SwapModal 
        open={open} 
        onClose={()=>{setOpen(false); setTarget(null)}} 
        mySwappable={mine} 
        onSubmit={request} 
        targetSlot={target}
        loading={requesting}
      />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}


