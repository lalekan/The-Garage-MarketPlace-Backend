import { createContext, useState, useEffect } from 'react'
import { CheckSession, RefreshToken } from './Auth'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkToken = async () => {
    console.log('checkToken function called') // Debug log
  
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('No token found in localStorage') // Debug log
      setAuthenticated(false)
      setLoading(false)
      return
    }
  
    try {
      console.log('Token retrieved from localStorage:', token); // Debug log
      const userData = await CheckSession(token) // Validate authToken
      console.log('User data from CheckSession:', userData) // Debug log
      setUser(userData)
      setAuthenticated(true)
    } catch (err) {
      console.error('Session validation failed:', err.message)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }
  
  

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, authenticated, setUser, setAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
