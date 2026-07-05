import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Product, CartItem } from '../types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'DECREASE_QUANTITY'; productId: string }
  | { type: 'CLEAR' }

interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  itemCount: number
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id
      )
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (item) => item.product.id !== action.productId
        ),
      }
    case 'DECREASE_QUANTITY': {
      const existing = state.items.find(
        (item) => item.product.id === action.productId
      )
      if (!existing) return state
      if (existing.quantity === 1) {
        return {
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        }
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const addItem = (product: Product) =>
    dispatch({ type: 'ADD_ITEM', product })
  const removeItem = (productId: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId })
  const decreaseQuantity = (productId: string) =>
    dispatch({ type: 'DECREASE_QUANTITY', productId })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  return (
    <CartContext.Provider
      value={{ items: state.items, total, addItem, removeItem, decreaseQuantity, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
