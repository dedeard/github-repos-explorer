import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
