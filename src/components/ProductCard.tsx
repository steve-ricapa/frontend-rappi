import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
  index?: number
}

export default function ProductCard({ product, onAdd, index = 0 }: ProductCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
    >
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
        ) : (
          <div className="text-gray-300 text-4xl font-bold">🍗</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-gray-900">S/ {product.price.toFixed(2)}</span>
          <button
            onClick={() => onAdd(product)}
            className="size-9 rounded-full bg-rappi hover:bg-rappi-dark active:bg-rappi-dark text-white flex items-center justify-center text-lg font-bold transition-all duration-200 active:scale-90"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
