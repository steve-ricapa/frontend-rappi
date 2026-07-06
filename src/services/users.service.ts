import { gcpApi } from './api'

export async function login(email: string, password: string) {
  const { data } = await gcpApi.post('/rappi/auth/login', { email, password })
  return data.data
}

export async function register(name: string, email: string, password: string) {
  const { data } = await gcpApi.post('/rappi/auth/register', { name, email, password })
  return data.data
}
