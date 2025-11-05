import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }[type]

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto ${bgColor} text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in max-w-sm sm:max-w-none`}>
      <span className="text-lg sm:text-xl">{icon}</span>
      <span className="font-medium text-sm sm:text-base flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 text-lg sm:text-xl min-w-[24px] min-h-[24px] flex items-center justify-center">✕</button>
    </div>
  )
}

