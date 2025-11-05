export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }[size]

  return (
    <div className={`${sizeClasses} border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
  )
}

