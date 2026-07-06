export type OrderStatus = string

export interface OrderStage {
  name: string
  startTime: string | null
  endTime: string | null
  assignedTo: string | null
}

export interface Order {
  externalOrderId: string
  awsOrderId?: string
  tenantId?: string
  customerName?: string
  status: string
  items?: { productId: string; name: string; price: number; quantity: number }[]
  total?: number
  createdAt: string
  updatedAt: string
  statusHistory?: { status: string; timestamp: string; source: string }[]
  stages?: OrderStage[]
}
