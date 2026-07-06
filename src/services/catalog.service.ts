import { awsApi } from './api'

export async function getStores() {
  const { data } = await awsApi.get('/stores')
  return data.data || []
}

export async function getProducts(tenantId: string) {
  const { data } = await awsApi.get('/products', { params: { tenantId } })
  return data.data || []
}
