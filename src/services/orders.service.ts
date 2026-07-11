import { gcpApi } from './api'

const STATUS_API = import.meta.env.VITE_GCP_STATUS_API

export async function createRappiOrder(payload: {
  tenantId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: { productId: string; name: string; price: number; quantity: number }[]
  total: number
}) {
  const { data } = await gcpApi.post('/rappi/orders', payload)
  return data.data
}

export async function getOrder(externalOrderId: string) {
  const r = await fetch(`${STATUS_API}/rappi/orders/${externalOrderId}`)
  const body = await r.json()
  return body.data || null
}

export async function confirmReception(externalOrderId: string, tenantId: string) {
  const { data } = await gcpApi.post(`/rappi/orders/${externalOrderId}/confirm`, { tenantId })
  return data.data
}

export async function getAllOrders(email?: string) {
  const url = email
    ? `${STATUS_API}/rappi/orders?email=${encodeURIComponent(email)}`
    : `${STATUS_API}/rappi/orders`
  const r = await fetch(url)
  const body = await r.json()
  return body.data || []
}
