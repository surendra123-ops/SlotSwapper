import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function EventForm({ onSubmit, initial, loading = false }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [startTime, setStartTime] = useState(initial ? toLocalInput(initial.startTime) : '')
  const [endTime, setEndTime] = useState(initial ? toLocalInput(initial.endTime) : '')
  const [status, setStatus] = useState(initial?.status || 'BUSY')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!startTime || !endTime) {
      alert('Please select both start and end times')
      return
    }
    if (new Date(endTime) <= new Date(startTime)) {
      alert('End time must be after start time')
      return
    }
    onSubmit({ title, startTime: new Date(startTime), endTime: new Date(endTime), status })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="event-title" className="block text-sm font-semibold text-gray-700 mb-2">
          📝 Event Title <span className="text-red-500">*</span>
        </label>
        <input 
          id="event-title"
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          placeholder="e.g., Team Meeting, Gym Session, Focus Time" 
          className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1.5">Give your event a descriptive name so others can understand what it is</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="event-start" className="block text-sm font-semibold text-gray-700 mb-2">
            🕐 Start Date & Time <span className="text-red-500">*</span>
          </label>
          <input 
            id="event-start"
            type="datetime-local" 
            value={startTime} 
            onChange={e=>setStartTime(e.target.value)} 
            className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1.5">When does this event start?</p>
        </div>
        <div>
          <label htmlFor="event-end" className="block text-sm font-semibold text-gray-700 mb-2">
            🕐 End Date & Time <span className="text-red-500">*</span>
          </label>
          <input 
            id="event-end"
            type="datetime-local" 
            value={endTime} 
            onChange={e=>setEndTime(e.target.value)} 
            className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm" 
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1.5">When does this event end? Must be after start time</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="event-status" className="block text-sm font-semibold text-gray-700 mb-2">
          🔄 Availability Status
        </label>
        <select 
          id="event-status"
          value={status} 
          onChange={e=>setStatus(e.target.value)} 
          className="w-full border border-gray-300 px-4 py-3 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
          disabled={loading}
        >
          <option value="BUSY">🔒 BUSY - Not available for swap</option>
          <option value="SWAPPABLE">🔄 SWAPPABLE - Available for swap</option>
        </select>
        <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-1">
            {status === 'SWAPPABLE' ? '🟢 SWAPPABLE Mode:' : '🔴 BUSY Mode:'}
          </p>
          <p className="text-xs text-gray-600">
            {status === 'SWAPPABLE' 
              ? 'This event will appear in the Marketplace. Other users can request to swap their swappable slots for this one.' 
              : 'This event is private and will not appear in the Marketplace. Only you can see it.'}
          </p>
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 text-base sm:text-sm"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Saving...</span>
          </>
        ) : (
          <span>💾 Save Event</span>
        )}
      </button>
    </form>
  )
}

function toLocalInput(dateStr) {
  const d = new Date(dateStr)
  const tzoffset = d.getTimezoneOffset() * 60000
  return new Date(d - tzoffset).toISOString().slice(0,16)
}


