import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getOrder } from '../services/orders.service'
import OrderTimeline from '../components/OrderTimeline'
import AnimatedPage from '../components/AnimatedPage'
import type { Order } from '../types'

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { clearUser } = useUser()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrder = useCallback(async () => {
    if (!id) return
    try {
      const data = await getOrder(id)
      setOrder(data)
    } catch {
      //
    }
  }, [id])

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false))
  }, [fetchOrder])

  const refreshOrder = async () => {
    setRefreshing(true)
    await fetchOrder()
    setRefreshing(false)
  }

  const handleNewOrder = () => {
    clearUser()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-8 border-2 border-rappi border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Pedido no encontrado</p>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido #{order.orderId}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Creado el {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={refreshOrder}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg
              className={`size-4 ${refreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <OrderTimeline status={order.status} stages={order.stages} />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/catalog')}
            className="flex-1 py-3.5 rounded-xl bg-rappi hover:bg-rappi-dark text-white font-semibold text-sm transition-colors"
          >
            Seguir comprando
          </button>
          <button
            onClick={handleNewOrder}
            className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors"
          >
            Nuevo pedido
          </button>
        </div>
      </div>
    </AnimatedPage>
  )
}
