import { useNavigate } from 'react-router-dom'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate()

  return (
    <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-red-400">Something went wrong</h3>
          <p className="text-sm text-gray-400">
            {error.message}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => {
              resetErrorBoundary()
              navigate('/home')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback 