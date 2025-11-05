export default function EventList({ events, onEdit, onDelete, onMakeSwappable }) {
  return (
    <div className="space-y-2">
      {events.map(e => (
        <div key={e._id} className="bg-white border rounded p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-gray-600">{fmt(e.startTime)} - {fmt(e.endTime)}</div>
            <div className="text-xs mt-1"><span className="px-2 py-0.5 rounded bg-gray-100">{e.status}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>onEdit(e)} className="px-2 py-1 text-sm border rounded">Edit</button>
            <button onClick={()=>onDelete(e)} className="px-2 py-1 text-sm border rounded">Delete</button>
            {e.status !== 'SWAPPABLE' && (
              <button onClick={()=>onMakeSwappable(e)} className="px-2 py-1 text-sm bg-emerald-600 text-white rounded">Make Swappable</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function fmt(d){ return new Date(d).toLocaleString() }


