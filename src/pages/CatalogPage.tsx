import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'
import { getCatalog } from '../services/catalog.service'
import ProductCard from '../components/ProductCard'
import CartSidebar from '../components/CartSidebar'
import AnimatedPage from '../components/AnimatedPage'
import type { Product } from '../types'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-200 animate-shimmer" />
        <div className="h-3 w-full rounded bg-gray-100 animate-shimmer" />
        <div className="h-3 w-1/2 rounded bg-gray-100 animate-shimmer" />
        <div className="flex justify-between pt-1">
          <div className="h-4 w-16 rounded bg-gray-200 animate-shimmer" />
          <div className="size-9 rounded-full bg-gray-200 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true })
      return
    }

    getCatalog()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, navigate])

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="size-16 shrink-0">
              <img src="/PopeyesLogoLargo.png" alt="Popeyes" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Popeyes</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Selecciona tus productos favoritos
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              No hay productos disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addItem}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        <CartSidebar />
      </div>
    </AnimatedPage>
  )
}
