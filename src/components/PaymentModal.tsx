import { useState } from 'react'
import type { CartItem } from '../types'

interface PaymentModalProps {
  items: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
}

type PaymentState = 'idle' | 'processing' | 'success'

export default function PaymentModal({ items, total, onClose, onSuccess }: PaymentModalProps) {
  const [state, setState] = useState<PaymentState>('idle')

  const handlePay = () => {
    setState('processing')
    setTimeout(() => {
      setState('success')
      setTimeout(() => {
        onSuccess()
      }, 1200)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {state === 'success' ? 'Pago exitoso' : 'Pagar pedido'}
          </h2>
          {state === 'idle' && (
            <button onClick={onClose} className="size-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm hover:bg-gray-200 transition-colors">
              ✕
            </button>
          )}
        </div>

        {state === 'success' ? (
          <div className="px-6 pb-8 pt-4 flex flex-col items-center gap-4">
            <div className="size-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
              <svg className="size-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-green-700 font-medium text-sm">Tu pago fue procesado correctamente</p>
          </div>
        ) : (
          <>
            {/* Card form */}
            <div className="px-6 pb-4 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Número de tarjeta</p>
                  <p className="text-sm font-mono text-gray-900 tracking-wider">4242 4242 4242 4242</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Vencimiento</p>
                    <p className="text-sm font-mono text-gray-900">12/28</p>
                  </div>
                  <div className="w-20">
                    <p className="text-xs text-gray-400 mb-1">CVC</p>
                    <p className="text-sm font-mono text-gray-900">***</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Titular</p>
                  <p className="text-sm font-medium text-gray-900">Tarjeta de prueba</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 text-center">Esta es una simulación. No se realizará ningún cobro real.</p>
            </div>

            {/* Order summary */}
            <div className="px-6 pb-4 border-t border-gray-100 pt-4 space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="text-gray-900 font-medium shrink-0">
                    S/ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total + button */}
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">S/ {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={state === 'processing'}
                className="w-full py-3.5 rounded-xl bg-rappi hover:bg-rappi-dark disabled:bg-rappi/40 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {state === 'processing' ? (
                  <>
                    <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Procesando pago...
                  </>
                ) : (
                  `Pagar S/ ${total.toFixed(2)}`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
