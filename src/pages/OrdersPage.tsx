import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getAllOrders } from '../services/orders.service'
import AnimatedPage from '../components/AnimatedPage'
import type { Order } from '../types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const navigate = useNavigate()

  const fetchOrders = useCallback(async () => {
    if (!user) return
    try {
      const data = await getAllOrders(user.email)
      setOrders(data || [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true })
      return
    }
    fetchOrders()
  }, [user, navigate, fetchOrders])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-8 border-2 border-rappi border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <img src="/motorappi.png" alt="" className="size-32 object-contain mb-6 opacity-60" />
            <p className="text-gray-500 text-sm mb-6">Aún no has realizado pedidos</p>
            <button onClick={() => navigate('/restaurants')} className="px-6 py-3 rounded-xl bg-rappi hover:bg-rappi-dark text-white font-semibold text-sm transition-colors">
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <button
                key={order.externalOrderId}
                onClick={() => navigate(`/orders/${order.externalOrderId}`)}
                className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">#{order.externalOrderId}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items?.length || 0} productos · Popeyes
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{order.status}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-3">
                  {new Date(order.createdAt).toLocaleDateString('es-PE', {
                    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
