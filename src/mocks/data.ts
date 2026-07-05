import type { User, Product, Order, OrderStatus, CreateOrderPayload } from '../types'

export interface ProductInfo {
  name: string
  quantity: number
}

export const mockUsers: User[] = [
  { id: 'user-001', name: 'Juan Pérez', phone: '+51 999 888 777', address: 'Av. Larco 123, Miraflores' },
  { id: 'user-002', name: 'María López', phone: '+51 988 777 666', address: 'Jr. de la Unión 456, Lima' },
  { id: 'user-003', name: 'Carlos Ramírez', phone: '+51 977 666 555', address: 'Av. Benavides 789, Surco' },
]

export const mockProducts: Product[] = [
  {
    id: 'pop-001',
    name: 'Crispy Chicken Sandwich',
    description: 'Pechuga de pollo empanizada, lechuga, mayonesa y pepinillos en pan brioche',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13030?w=400&h=300&fit=crop',
    price: 18.90,
  },
  {
    id: 'pop-002',
    name: 'Popcorn Chicken Box',
    description: 'Porción de pop corn chicken, papas fritas, ensalada de col y gaseosa',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    price: 24.50,
  },
  {
    id: 'pop-003',
    name: 'Family Bucket',
    description: '8 piezas de pollo, 4 porciones de papas, 4 panes y 1 balde de ensalada de col',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    price: 45.90,
  },
  {
    id: 'pop-004',
    name: 'Mashed Potatoes & Gravy',
    description: 'Puré de papas cremoso bañado en gravy de pollo',
    imageUrl: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400&h=300&fit=crop',
    price: 7.50,
  },
  {
    id: 'pop-005',
    name: 'Biscuit x4',
    description: '4 panecillos horneados de mantequilla, suaves y esponjosos',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    price: 9.90,
  },
  {
    id: 'pop-006',
    name: 'Cajún Fries Large',
    description: 'Papas fritas sazonadas con especias cajún, porción grande',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    price: 11.50,
  },
  {
    id: 'pop-007',
    name: 'Chicken Tenders (5 pz)',
    description: '5 tiras de pechuga empanizada, servidas con salsa ranch o BBQ',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    price: 21.90,
  },
  {
    id: 'pop-008',
    name: 'Pepsi 500ml',
    description: 'Gaseosa Pepsi fría, 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ec8e81c5?w=400&h=300&fit=crop',
    price: 4.50,
  },
  {
    id: 'pop-009',
    name: 'Applie Pie',
    description: 'Pastelito horneado relleno de manzana, cubierto de azúcar glas',
    imageUrl: 'https://images.unsplash.com/photo-1621743478914-cc8a860d9e8c?w=400&h=300&fit=crop',
    price: 6.90,
  },
]

export const mockOrders = new Map<string, Order>()

const STAGES: OrderStatus[] = ['RECEIVED', 'COOKING', 'PACKING', 'ON_THE_WAY', 'DELIVERED']

export function createMockOrder(payload: CreateOrderPayload): Order {
  const now = new Date()
  const orderId = `ORD-${String(mockOrders.size + 1).padStart(5, '0')}`

  const order: Order = {
    orderId,
    userId: payload.userId,
    status: 'RECEIVED',
    items: payload.items,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    stages: STAGES.map((name, i) => ({
      name,
      startTime: i === 0 ? now.toISOString() : null,
      endTime: null,
      assignedTo: i === 0 ? 'Sistema' : null,
    })),
  }

  mockOrders.set(orderId, order)
  return order
}

export function getUserOrders(userId: string): Order[] {
  return Array.from(mockOrders.values()).filter((o) => o.userId === userId)
}

export function advanceOrderStatus(orderId: string): Order | null {
  const order = mockOrders.get(orderId)
  if (!order) return null

  const currentIdx = STAGES.indexOf(order.status)

  if (currentIdx < STAGES.length - 1) {
    const now = new Date().toISOString()

    if (order.stages?.[currentIdx]) {
      order.stages[currentIdx].endTime = now
    }

    const nextStatus = STAGES[currentIdx + 1]
    order.status = nextStatus

    if (order.stages?.[currentIdx + 1]) {
      order.stages[currentIdx + 1].startTime = now
    }

    const assignees = ['Juan Cocinero', 'Pedro Empacador', 'Luis Repartidor', '']
    if (order.stages?.[currentIdx + 1] && assignees[currentIdx]) {
      order.stages[currentIdx + 1].assignedTo = assignees[currentIdx]
    }

    order.updatedAt = now
  }

  return order
}
