export default function EventList({ events, onEdit, onDelete, onMakeSwappable }) {
  const getStatusBadge = (status) => {
    const badges = {
      BUSY: { text: '🔒 BUSY', bg: 'bg-gray-100 text-gray-800', desc: 'Not available for swap' },
      SWAPPABLE: { text: '🔄 SWAPPABLE', bg: 'bg-green-100 text-green-800', desc: 'Available for swap' },
      SWAP_PENDING: { text: '⏳ PENDING', bg: 'bg-yellow-100 text-yellow-800', desc: 'Swap in progress' }
    }
    return badges[status] || badges.BUSY
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {events.map(e => {
        const statusBadge = getStatusBadge(e.status)
        return (
          <div key={e._id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{e.title}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.bg} self-start sm:self-auto`}>
                    {statusBadge.text}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                  <span className="font-medium">📅 Start:</span> <span className="break-all">{fmt(e.startTime)}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                  <span className="font-medium">📅 End:</span> <span className="break-all">{fmt(e.endTime)}</span>
                </div>
                <p className="text-xs text-gray-500">{statusBadge.desc}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                <button 
                  onClick={()=>onEdit(e)} 
                  className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0"
                  title="Edit event"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={()=>onDelete(e)} 
                  className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] sm:min-h-0"
                  title="Delete event"
                >
                  🗑️ Delete
                </button>
                {e.status !== 'SWAPPABLE' && e.status !== 'SWAP_PENDING' && (
                  <button 
                    onClick={()=>onMakeSwappable(e)} 
                    className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors min-h-[44px] sm:min-h-0"
                    title="Make this event available for swapping"
                  >
                    🔄 Make Swappable
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function fmt(d){ 
  const date = new Date(d)
  return date.toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}


