import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { createRappiOrder } from '../services/orders.service'
import PaymentModal from './PaymentModal'

function CartIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export default function CartSidebar() {
  const { items, total, addItem, decreaseQuantity, removeItem, clearCart, itemCount, tenantId } = useCart()
  const { user } = useUser()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const handlePaymentSuccess = async (customerName: string, customerPhone: string, deliveryAddress: string) => {
    if (!user || items.length === 0) return
    try {
      const order = await createRappiOrder({
        tenantId: tenantId || '',
        customerName,
        customerPhone,
        deliveryAddress,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total,
      })
      clearCart()
      setShowPayment(false)
      setOpen(false)
      showToast(`Pedido #${order.externalOrderId} creado exitosamente`)
      navigate(`/orders/${order.externalOrderId}`)
    } catch {
      showToast('Error al crear el pedido', 'error')
    }
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CartIcon />
          Carrito ({itemCount})
        </h2>
        <button onClick={() => setOpen(false)} className="sm:hidden size-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center pt-8">Tu carrito está vacío</p>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="flex gap-3 animate-slide-up" style={{ animationFillMode: 'backwards' }}>
              <div className="size-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                <img src={item.product.imageUrl || ''} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">S/ {(item.product.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => decreaseQuantity(item.product.id)} className="size-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors">−</button>
                  <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                  <button onClick={() => addItem(item.product)} className="size-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors text-sm mt-1">✕</button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-100 px-5 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">S/ {total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => setShowPayment(true)}
          disabled={items.length === 0 || !user || !tenantId}
          className="w-full py-3 rounded-xl bg-rappi hover:bg-rappi-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
        >
          Realizar pedido
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 sm:hidden size-14 rounded-full bg-rappi text-white shadow-lg flex items-center justify-center transition-transform active:scale-90">
        <span className="relative">
          <CartIcon />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 size-5 rounded-full bg-white text-red-500 text-[10px] font-bold flex items-center justify-center shadow-sm">{itemCount}</span>
          )}
        </span>
      </button>
      {open && <div className="fixed inset-0 z-40 bg-black/40 sm:hidden animate-fade-in" onClick={() => setOpen(false)} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transition-transform duration-300 sm:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>{content}</div>
      <div className="hidden sm:block w-80 shrink-0 border-l border-gray-100 bg-white">{content}</div>
      {showPayment && (
        <PaymentModal
          items={items}
          total={total}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  )
}
