import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'

export default function Requests(){
  const { api } = useAuth()
  const { socket } = useSocket()
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(null)
  const [toast, setToast] = useState(null)

  const load = async ()=>{
    try {
      setLoading(true)
      const { data } = await api.get('/api/requests')
      setIncoming(data.incoming)
      setOutgoing(data.outgoing)
    } catch (err) {
      setToast({ message: 'Failed to load requests', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{
    if(!socket) return
    const refresh = ()=> {
      setToast({ message: 'Requests updated!', type: 'info' })
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

  const respond = async (id, accepted)=>{
    try {
      setResponding(id)
      await api.post(`/api/swap-response/${id}`, { accepted })
      setToast({ 
        message: accepted ? 'Swap accepted! Events have been swapped.' : 'Swap rejected.', 
        type: accepted ? 'success' : 'info' 
      })
      await load()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to respond', type: 'error' })
    } finally {
      setResponding(null)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: '⏳ PENDING', bg: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      ACCEPTED: { text: '✅ ACCEPTED', bg: 'bg-green-100 text-green-800', icon: '✅' },
      REJECTED: { text: '❌ REJECTED', bg: 'bg-red-100 text-red-800', icon: '❌' }
    }
    return badges[status] || badges.PENDING
  }

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">📬 Swap Requests</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage incoming and outgoing swap requests</p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Incoming Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📥 Incoming Requests</h2>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {incoming.length}
              </span>
            </div>
            <div className="space-y-4">
              {incoming.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-500 text-sm">No incoming requests</p>
                </div>
              ) : (
                incoming.map(r=> {
                  const statusBadge = getStatusBadge(r.status)
                  return (
                    <div key={r._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">👤</span>
                          <span className="font-semibold text-gray-900">{r.requesterId?.name || 'Unknown User'}</span>
                          <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.bg}`}>
                            {statusBadge.text}
                          </span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                          <p className="text-xs text-blue-700 font-medium mb-1">They're offering:</p>
                          <p className="text-sm font-semibold text-gray-900">{r.mySlotId?.title || 'N/A'}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {r.mySlotId?.startTime && new Date(r.mySlotId.startTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs text-green-700 font-medium mb-1">They want your:</p>
                          <p className="text-sm font-semibold text-gray-900">{r.theirSlotId?.title || 'N/A'}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {r.theirSlotId?.startTime && new Date(r.theirSlotId.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {r.status==='PENDING' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                          <button 
                            onClick={()=>respond(r._id, true)} 
                            disabled={responding === r._id}
                            className="flex-1 px-4 py-3 sm:py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0"
                          >
                            {responding === r._id ? (
                              <>
                                <LoadingSpinner size="sm" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <span>✅ Accept</span>
                            )}
                          </button>
                          <button 
                            onClick={()=>respond(r._id, false)} 
                            disabled={responding === r._id}
                            className="flex-1 px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Outgoing Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📤 Outgoing Requests</h2>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {outgoing.length}
              </span>
            </div>
            <div className="space-y-4">
              {outgoing.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-gray-500 text-sm">No outgoing requests</p>
                </div>
              ) : (
                outgoing.map(r=> {
                  const statusBadge = getStatusBadge(r.status)
                  return (
                    <div key={r._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">👤</span>
                          <span className="font-semibold text-gray-900">{r.receiverId?.name || 'Unknown User'}</span>
                          <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.bg}`}>
                            {statusBadge.text}
                          </span>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                          <p className="text-xs text-green-700 font-medium mb-1">You're offering:</p>
                          <p className="text-sm font-semibold text-gray-900">{r.mySlotId?.title || 'N/A'}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {r.mySlotId?.startTime && new Date(r.mySlotId.startTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-700 font-medium mb-1">You want their:</p>
                          <p className="text-sm font-semibold text-gray-900">{r.theirSlotId?.title || 'N/A'}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {r.theirSlotId?.startTime && new Date(r.theirSlotId.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {r.status === 'PENDING' && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-gray-500 text-center">⏳ Waiting for response...</p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}


