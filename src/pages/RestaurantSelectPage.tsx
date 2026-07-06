import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import AnimatedPage from '../components/AnimatedPage'

const RESTAURANTS = [
  {
    id: 'mr-sushi',
    name: 'Mr Sushi',
    description: 'Rollos, nigiris y comida japonesa',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop',
    available: false,
  },
  {
    id: 'papa-johns',
    name: 'Papa Johns',
    description: 'Pizzas artesanales y toppings infinitos',
    imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&h=400&fit=crop',
    available: false,
  },
  {
    id: 'popeyes',
    name: 'Popeyes',
    description: 'Pollo empanizado al estilo cajún',
    imageUrl: '/LogoPopeyeBlancoFondoNaranja.png',
    available: true,
  },
  {
    id: 'burger-king',
    name: 'Burger King',
    description: 'Hamburguesas a la parrilla y papas',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    available: false,
  },
  {
    id: 'madam-tusan',
    name: 'Madam Tusan',
    description: 'Comida chifa y fusión asiática',
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop',
    available: false,
  },
]

export default function RestaurantSelectPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleClick = (r: typeof RESTAURANTS[0]) => {
    if (!r.available) {
      showToast(`${r.name} no está disponible por el momento`, 'info')
      return
    }
    navigate('/stores')
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Elige un restaurante</h1>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona el restaurante para tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESTAURANTS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleClick(r)}
              className={`relative group rounded-2xl overflow-hidden text-left transition-all duration-200 animate-slide-up ${
                r.available ? 'hover:shadow-lg hover:-translate-y-1' : ''
              }`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                {r.id === 'popeyes' ? (
                  <img src={r.imageUrl} alt={r.name} className="w-4/5 object-contain transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {!r.available && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
                  <span className="bg-gray-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Próximamente
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className={`text-lg font-bold ${r.available ? 'text-white' : 'text-gray-400'}`}>
                  {r.name}
                </h3>
                <p className={`text-xs mt-0.5 ${r.available ? 'text-white/80' : 'text-gray-400'}`}>
                  {r.description}
                </p>
                {r.available && (
                  <span className="inline-block mt-2 text-[10px] font-semibold text-green-300 bg-green-900/40 px-2 py-0.5 rounded-full">
                    Disponible
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </AnimatedPage>
  )
}
