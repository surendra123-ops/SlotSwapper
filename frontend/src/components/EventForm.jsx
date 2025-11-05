import { useState } from 'react'

export default function EventForm({ onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [startTime, setStartTime] = useState(initial ? toLocalInput(initial.startTime) : '')
  const [endTime, setEndTime] = useState(initial ? toLocalInput(initial.endTime) : '')
  const [status, setStatus] = useState(initial?.status || 'BUSY')

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ title, startTime: new Date(startTime), endTime: new Date(endTime), status })
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded" />
      <div className="grid grid-cols-2 gap-3">
        <input type="datetime-local" value={startTime} onChange={e=>setStartTime(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)} className="border px-3 py-2 rounded" />
      </div>
      <select value={status} onChange={e=>setStatus(e.target.value)} className="border px-3 py-2 rounded">
        <option value="BUSY">BUSY</option>
        <option value="SWAPPABLE">SWAPPABLE</option>
      </select>
      <button className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  )
}

function toLocalInput(dateStr) {
  const d = new Date(dateStr)
  const tzoffset = d.getTimezoneOffset() * 60000
  return new Date(d - tzoffset).toISOString().slice(0,16)
}


