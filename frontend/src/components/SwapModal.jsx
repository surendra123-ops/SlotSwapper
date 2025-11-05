import { useEffect, useState } from 'react'

export default function SwapModal({ open, onClose, mySwappable, onSubmit, targetSlot }) {
  const [selected, setSelected] = useState('')
  useEffect(()=>{ if(open) setSelected('') },[open])
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow max-w-md w-full p-4">
        <h3 className="font-semibold mb-2">Request swap for: {targetSlot?.title}</h3>
        <p className="text-sm text-gray-600 mb-3">Select one of your swappable slots:</p>
        <select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full border rounded px-3 py-2 mb-4">
          <option value="">-- choose --</option>
          {mySwappable.map(e=> (
            <option key={e._id} value={e._id}>{e.title} ({new Date(e.startTime).toLocaleString()})</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 border rounded">Cancel</button>
          <button disabled={!selected} onClick={()=>onSubmit(selected)} className="px-3 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50">Send Request</button>
        </div>
      </div>
    </div>
  )
}


