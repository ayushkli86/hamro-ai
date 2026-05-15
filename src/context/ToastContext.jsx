import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const toastId = ++id
    setToasts((prev) => [...prev, { id: toastId, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id}
            className={`px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all animate-slide-up
              ${t.type === 'success' ? 'bg-green-600' :
                t.type === 'error' ? 'bg-red-600' :
                t.type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
