import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Listings from './components/Listings/Listings'
import CreateListing from './components/Listings/CreateListing'
import EditListing from './components/Listings/EditListing'
import Login from './pages/Login'
import Register from './pages/Register'
import Inbox from './components/Messages/Inbox'
import SendMessage from './components/Messages/SendMessage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './api/AuthContext'
import { useContext } from 'react'
import './styles/App.css'

const App = () => {
  const { user, authenticated, setUser, setAuthenticated, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    setAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Navbar
        isAuthenticated={authenticated}
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Listings />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <EditListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-message"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <SendMessage />
            </ProtectedRoute>
          }
        />

        {/* Invalid URLs */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
