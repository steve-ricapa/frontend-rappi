import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getStores } from '../services/catalog.service'
import AnimatedPage from '../components/AnimatedPage'
import type { Store } from '../types'

export default function StoreSelectPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const { setTenantId, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    clearCart()
    getStores()
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (store: Store) => {
    setTenantId(store.tenantId)
    navigate(`/catalog?tenantId=${encodeURIComponent(store.tenantId)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-8 border-2 border-rappi border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <img src="/PopeyesLogoLargo.png" alt="Popeyes" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Elige tu sede Popeyes</h1>
          <p className="text-sm text-gray-500 mt-1">Selecciona la sede más cercana</p>
        </div>

        {stores.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No hay sedes disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store, i) => (
              <button
                key={store.tenantId}
                onClick={() => handleSelect(store)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
              >
                <div className="size-14 rounded-full bg-rappi/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-rappi font-bold text-xl">
                    {store.tenantId === 'popeyes-miraflores' ? 'M' : store.tenantId === 'popeyes-surco' ? 'S' : 'B'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-center">
                  {store.tenantId === 'popeyes-miraflores' ? 'Miraflores' :
                   store.tenantId === 'popeyes-surco' ? 'Surco' :
                   store.tenantId === 'popeyes-barranco' ? 'Barranco' :
                   store.tenantId}
                </h3>
                {store.name && (
                  <p className="text-xs text-gray-400 text-center mt-1">{store.name}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
