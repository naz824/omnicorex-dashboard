// ============================================================================
// Error Boundary Component — Production-Grade Error Handling
// ============================================================================
// React error boundary that catches rendering errors and displays user-friendly messages
// with OmnicoreX dark theme styling

import type { ReactNode, ErrorInfo } from 'react'
import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

declare const process: { env: { NODE_ENV: string } }

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in the child component tree
 * and logs those errors, displays a fallback UI, and allows recovery
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return {
      hasError: true,
    }
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught error:', _error)
    console.error('Error info:', errorInfo)

    // Update state with error details
    this.setState((prevState) => ({
      error: _error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // In production, you might want to send this to an error logging service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(_error, errorInfo)
    }
  }

  private logErrorToService(_error: Error, _errorInfo: ErrorInfo): void {
    // Error logging service integration point
    // In production, send to error tracking service (e.g., Sentry, LogRocket, etc.)
    // Example:
    // const errorData = {
    //   message: error.toString(),
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack,
    //   timestamp: new Date().toISOString(),
    //   userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    // }
    // fetch('/api/logs/error', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(errorData) }).catch(err => console.error('Failed to log error:', err))
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    const { hasError, error, errorInfo, errorCount } = this.state
    const { children, fallback } = this.props

    if (!hasError) {
      return children
    }

    // Allow custom fallback UI
    if (fallback && error) {
      return fallback(error, this.handleReset)
    }

    // Default fallback UI with OmnicoreX dark theme
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Error Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            {/* Header with red accent */}
            <div className="bg-gradient-to-r from-rose-500/10 to-rose-500/5 border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                <h1 className="text-lg font-semibold text-rose-400">Something went wrong</h1>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Error message */}
              <div>
                <h2 className="text-sm font-medium text-slate-300 mb-2">Error Message</h2>
                <div className="bg-slate-800/50 border border-slate-700 rounded px-4 py-3">
                  <p className="text-sm text-slate-200 font-mono break-words">
                    {error?.toString() || 'An unknown error occurred'}
                  </p>
                </div>
              </div>

              {/* Error count indicator */}
              {errorCount > 1 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded px-4 py-3">
                  <p className="text-sm text-amber-200">
                    This error has occurred {errorCount} times in this session.
                  </p>
                </div>
              )}

              {/* Stack trace in development */}
              {process.env.NODE_ENV === 'development' && errorInfo?.componentStack && (
                <div>
                  <h2 className="text-sm font-medium text-slate-300 mb-2">Component Stack</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded px-4 py-3 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-words">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              )}

              {/* Debug information */}
              {process.env.NODE_ENV === 'development' && error?.stack && (
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors">
                    View full stack trace
                  </summary>
                  <div className="mt-3 bg-slate-800/50 border border-slate-700 rounded px-4 py-3 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-words">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Helper text */}
              <div className="bg-slate-800/30 border border-slate-700 rounded px-4 py-3">
                <p className="text-xs text-slate-400">
                  Try refreshing the page or contact support if the problem persists.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-800/50 border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-medium rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Error ID: {Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>
    )
  }
}

/**
 * Functional wrapper component for easier use in functional components
 */
export function ErrorBoundaryWrapper({
  children,
}: {
  children: ReactNode
}): ReactNode {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

export default ErrorBoundary
