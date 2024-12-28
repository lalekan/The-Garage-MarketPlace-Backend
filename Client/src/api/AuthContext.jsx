import { createContext, useState, useEffect } from 'react'
import { CheckSession } from './Auth'

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
      const userData = await CheckSession(token) // Pass token to validate
      setUser(userData.user) // Setting user state
      setAuthenticated(true) // Setting authenticated state
    } catch (err) {
      console.error('Error during session check:', err.message)
      localStorage.removeItem('authToken')
      setUser(null)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  console.log(user, setUser, authenticated, setAuthenticated, loading, "USER, SETUSER, AUTHENTICATED, SETAUTHENTICATED, LOADING IN AUTHCONTEXT")

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, setAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
