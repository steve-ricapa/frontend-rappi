export type OrderStatus =
  | "RECEIVED"
  | "COOKING"
  | "PACKING"
  | "ON_THE_WAY"
  | "DELIVERED"

export interface OrderItem {
  productId: string
  quantity: number
}

export interface CreateOrderPayload {
  userId: string
  items: OrderItem[]
}

export interface Order {
  orderId: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  stages?: OrderStage[]
}

export interface OrderStage {
  name: string
  startTime: string | null
  endTime: string | null
  assignedTo: string | null
}
