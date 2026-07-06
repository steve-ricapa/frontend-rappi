import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function UserSelectPage() {
  const { login, register, user } = useUser()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate('/restaurants', { replace: true })
    return null
  }

  const handleLogin = async () => {
    if (!email || !password) { setMsg('Completa email y contraseña'); return }
    setLoading(true); setMsg('')
    try {
      await login(email, password)
      navigate('/restaurants')
    } catch (e: any) {
      setMsg(e?.response?.data?.error || e?.message || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!name || !email || !password) { setMsg('Completa todos los campos'); return }
    setLoading(true); setMsg('')
    try {
      await register(name, email, password)
      navigate('/restaurants')
    } catch (e: any) {
      setMsg(e?.response?.data?.error || e?.message || 'Error al registrarse')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <img src="/LogoRappiDeLaAppParaRegistro.png" alt="Rappi" className="h-12 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Accede a tu cuenta Rappi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex mb-5 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'login' ? 'bg-rappi text-white' : 'text-gray-500'}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'register' ? 'bg-rappi text-white' : 'text-gray-500'}`}
            >
              Registrarse
            </button>
          </div>

          {tab === 'register' && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rappi/30 focus:border-rappi"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rappi/30 focus:border-rappi"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Contraseña</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rappi/30 focus:border-rappi"
            />
          </div>

          {msg && (
            <p className={`text-xs mb-3 ${msg.includes('exit') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
          )}

          <button
            onClick={tab === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rappi hover:bg-rappi-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading && <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {tab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </div>
      </div>
    </div>
  )
}
