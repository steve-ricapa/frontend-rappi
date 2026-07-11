import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getOrder, confirmReception } from '../services/orders.service'
import OrderTimeline from '../components/OrderTimeline'
import AnimatedPage from '../components/AnimatedPage'
import type { Order } from '../types'

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState('')

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
    if (!user) { navigate('/', { replace: true }); return }
    fetchOrder().finally(() => setLoading(false))
  }, [user, fetchOrder])

  const refreshOrder = async () => {
    setRefreshing(true)
    await fetchOrder()
    setRefreshing(false)
  }

  const handleConfirm = async () => {
    if (!order || confirming) return
    setConfirming(true)
    setConfirmError('')
    try {
      await confirmReception(order.externalOrderId, order.tenantId || 'popeyes-miraflores')
      await fetchOrder()
    } catch (e: any) {
      setConfirmError(e.message || 'Error al confirmar recepción')
    } finally {
      setConfirming(false)
    }
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

  const stages = order.stages || []
  const statusHistory = order.statusHistory || []

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.externalOrderId}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Creado el {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={refreshOrder}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg className={`size-4 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <OrderTimeline status={order.status} stages={stages} statusHistory={statusHistory} />
        </div>

        {order.status === 'DELIVERED' && (
          <div className="mt-6">
            {confirmError && (
              <p className="text-xs text-red-500 text-center mb-2">{confirmError}</p>
            )}
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-lg transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {confirming && <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Confirmar recepción
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Confirma que recibiste tu pedido correctamente</p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/catalog?tenantId=' + (order.tenantId || ''))} className="flex-1 py-3.5 rounded-xl bg-rappi hover:bg-rappi-dark text-white font-semibold text-sm transition-colors">
            Seguir comprando
          </button>
          <button onClick={() => { navigate('/restaurants') }} className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors">
            Nuevo pedido
          </button>
        </div>
      </div>
    </AnimatedPage>
  )
}
