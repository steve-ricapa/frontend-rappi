import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/Toast'
import MainLayout from './layouts/MainLayout'
import UserSelectPage from './pages/UserSelectPage'
import RestaurantSelectPage from './pages/RestaurantSelectPage'
import CatalogPage from './pages/CatalogPage'
import OrdersPage from './pages/OrdersPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <ToastProvider>
            <ToastContainer />
            <Routes>
              <Route path="/" element={<UserSelectPage />} />
              <Route element={<MainLayout />}>
                <Route path="/restaurants" element={<RestaurantSelectPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderTrackingPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}
