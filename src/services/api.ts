import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
  const { buildMockAdapter } = await import('../mocks/adapter')
  api.defaults.adapter = buildMockAdapter()
}

export default api
