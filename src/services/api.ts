import axios from 'axios'

export const awsApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_BASE_URL,
})

export const gcpApi = axios.create({
  baseURL: import.meta.env.VITE_GCP_ORDER_API,
})

gcpApi.interceptors.request.use((config) => {
  const t = localStorage.getItem('rappi-token')
  if (t) {
    config.headers.Authorization = 'Bearer ' + t
  }
  return config
})
