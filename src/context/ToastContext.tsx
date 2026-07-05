import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (text: string, type?: ToastMessage['type']) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, text, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
