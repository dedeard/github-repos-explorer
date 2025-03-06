import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div role="alert" className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
