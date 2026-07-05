import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useUser } from '../context/UserContext'

export default function MainLayout() {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  )
}
