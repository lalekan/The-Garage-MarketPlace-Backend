import { createContext, useState, useEffect } from 'react'
import { CheckSession, RefreshToken } from './Auth'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkToken = async () => {
    const token = localStorage.getItem('authToken')
  
    if (!token) {
      setAuthenticated(false)
      setLoading(false)
      return
    }
  
    try {
      const userData = await CheckSession(token)
      console.log('Restored user:', userData) 
      setUser(userData)
      setAuthenticated(true)
    } catch (err) {
      console.error('Error in CheckSession:', err.message)
  
      try {
        const newToken = await RefreshToken()
        const userData = await CheckSession(newToken)
        console.log('Restored user after refresh:', userData)
        setUser(userData)
        setAuthenticated(true)
      } catch (refreshErr) {
        console.error('Error refreshing token:', refreshErr.message)
        setUser(null)
        setAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }
  
  
  

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, setAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
