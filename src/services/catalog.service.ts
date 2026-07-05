import api from './api'
import type { Product } from '../types'

export async function getCatalog(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/catalog')
  return data
}
