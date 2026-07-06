import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/users.service'

interface UserData {
  email: string
  name: string
}

interface UserContextType {
  user: UserData | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function loadToken(): string | null {
  try {
    return localStorage.getItem('rappi-token')
  } catch {
    return null
  }
}

function loadUser(): UserData | null {
  try {
    const raw = localStorage.getItem('rappi-user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveAuth(token: string, user: UserData) {
  localStorage.setItem('rappi-token', token)
  localStorage.setItem('rappi-user', JSON.stringify(user))
}

function clearAuth() {
  localStorage.removeItem('rappi-token')
  localStorage.removeItem('rappi-user')
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(loadUser)
  const [token, setToken] = useState<string | null>(loadToken)

  useEffect(() => {
    if (token) {
      localStorage.setItem('rappi-token', token)
    } else {
      localStorage.removeItem('rappi-token')
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    const u: UserData = { email: data.email, name: data.name }
    saveAuth(data.token, u)
    setToken(data.token)
    setUser(u)
  }

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRegister(name, email, password)
    const u: UserData = { email: data.email, name: data.name }
    saveAuth(data.token, u)
    setToken(data.token)
    setUser(u)
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
