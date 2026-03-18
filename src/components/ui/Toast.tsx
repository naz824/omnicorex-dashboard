import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              toast.type === 'success'
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'
                : toast.type === 'error'
                  ? 'border-rose-400/20 bg-rose-400/10 text-rose-400'
                  : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-400'
            }`}
          >
            {toast.type === 'success' && <Check className="h-4 w-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-auto text-slate-400 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
