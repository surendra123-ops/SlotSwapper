import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function SwapModal({ open, onClose, mySwappable, onSubmit, targetSlot, loading = false }) {
  const [selected, setSelected] = useState('')
  useEffect(()=>{ if(open) setSelected('') },[open])
  if (!open) return null
  
  const selectedSlot = mySwappable.find(e => e._id === selected)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 my-auto" onClick={e => e.stopPropagation()}>
        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 Request Swap</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <label className="block text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
              🎯 Slot You Want to Swap For:
            </label>
            <p className="text-base font-semibold text-gray-900 mb-1">{targetSlot?.title}</p>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p><span className="font-medium">Start:</span> {new Date(targetSlot?.startTime).toLocaleString()}</p>
              <p><span className="font-medium">End:</span> {new Date(targetSlot?.endTime).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="swap-select" className="block text-sm font-semibold text-gray-700 mb-2">
              📤 Select Your Swappable Slot to Offer <span className="text-red-500">*</span>
            </label>
            
            {mySwappable.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ No Swappable Events Available</p>
                <p className="text-xs text-yellow-700">
                  You need at least one SWAPPABLE event to request swaps. Go to Dashboard and mark an event as SWAPPABLE.
                </p>
              </div>
            ) : (
              <>
                <select 
                  id="swap-select"
                  value={selected} 
                  onChange={e=>setSelected(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 sm:py-2.5 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
                  disabled={loading}
                >
                  <option value="">-- Choose your swappable slot to offer --</option>
                  {mySwappable.map(e=> (
                    <option key={e._id} value={e._id}>
                      {e.title} - {new Date(e.startTime).toLocaleString()}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Select which of your swappable slots you want to offer in exchange</p>
                
                {selectedSlot && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                    <label className="block text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
                      ✅ Slot You're Offering:
                    </label>
                    <p className="text-base font-semibold text-gray-900 mb-1">{selectedSlot.title}</p>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p><span className="font-medium">Start:</span> {new Date(selectedSlot.startTime).toLocaleString()}</p>
                      <p><span className="font-medium">End:</span> {new Date(selectedSlot.endTime).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0 text-base sm:text-sm"
          >
            Cancel
          </button>
          <button 
            disabled={!selected || loading || mySwappable.length === 0} 
            onClick={()=>onSubmit(selected)} 
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 text-base sm:text-sm"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Sending...</span>
              </>
            ) : (
              <span>📤 Send Request</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


