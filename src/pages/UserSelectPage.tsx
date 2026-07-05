import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getUsers } from '../services/users.service'
import type { User } from '../types'

export default function UserSelectPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearUser, setUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    clearUser()

    getUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleContinue = () => {
    const found = users.find((u) => u.id === selectedId)
    if (found) {
      setUser(found)
      navigate('/restaurants')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-8 border-2 border-rappi border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img
            src="/LogoRappiDeLaAppParaRegistro.png"
            alt="Rappi"
            className="h-12 mx-auto mb-4"
          />
          <p className="text-gray-500 text-sm">
            ¿Quién va a recibir el pedido?
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No hay usuarios disponibles
            </p>
          )}

          {users.map((u, i) => (
            <label
              key={u.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all animate-slide-up ${
                selectedId === u.id
                  ? 'border-rappi bg-rappi/5'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <input
                type="radio"
                name="userId"
                value={u.id}
                checked={selectedId === u.id}
                onChange={() => setSelectedId(u.id)}
                className="sr-only"
              />
              <span
                className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedId === u.id
                    ? 'border-rappi'
                    : 'border-gray-300'
                }`}
              >
                {selectedId === u.id && (
                  <span className="size-2.5 rounded-full bg-rappi" />
                )}
              </span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                <p className="text-xs text-gray-400">{u.address}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="mt-5 w-full py-3.5 rounded-xl bg-rappi hover:bg-rappi-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
