import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { mockUsers, mockProducts, createMockOrder, advanceOrderStatus, mockOrders, getUserOrders } from './data'

function matchUrl(config: InternalAxiosRequestConfig): AxiosResponse | null {
  const url = config.url ?? ''
  const method = (config.method ?? 'get').toLowerCase()

  if (method === 'get' && url === '/users') {
    return {
      data: mockUsers,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
    }
  }

  if (method === 'get' && url === '/catalog') {
    return {
      data: mockProducts,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
    }
  }

  if (method === 'post' && url === '/orders') {
    const payload = JSON.parse(config.data ?? '{}')
    const order = createMockOrder(payload)
    return {
      data: order,
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
    }
  }

  const userOrdersMatch = url.match(/^\/users\/([^/]+)\/orders$/)
  if (method === 'get' && userOrdersMatch) {
    const userId = userOrdersMatch[1]
    return {
      data: getUserOrders(userId),
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
    }
  }

  const orderMatch = url.match(/^\/orders\/(.+)$/)
  if (method === 'get' && orderMatch) {
    const orderId = orderMatch[1]
    let order = advanceOrderStatus(orderId)
    if (!order) {
      order = mockOrders.get(orderId) ?? null
    }
    if (order) {
      return {
        data: order,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
      }
    }
  }

  return null
}

export function buildMockAdapter() {
  return async function mockAdapter(
    config: InternalAxiosRequestConfig
  ): Promise<AxiosResponse> {
    const match = matchUrl(config)
    if (match) return match
    throw { message: 'Network Error', config, code: 'ERR_NETWORK' }
  }
}
