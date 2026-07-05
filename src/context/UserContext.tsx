import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const clearUser = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
