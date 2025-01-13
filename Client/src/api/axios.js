import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to handle token attachment and expiration
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('authToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (!token && refreshToken) {
    try {
      // Refresh the token
      const response = await axios.post('http://localhost:3000/api/auth/refresh-token', {
        refreshToken,
      })
      token = response.data.token
      localStorage.setItem('authToken', token)
    } catch (err) {
      console.error('Error refreshing token:', err.message)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      throw err
    }
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default API
