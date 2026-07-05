import api from './api'
import type { CreateOrderPayload, Order } from '../types'

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload)
  return data
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`)
  return data
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data } = await api.get<Order[]>(`/users/${userId}/orders`)
  return data
}
