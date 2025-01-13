import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Listings from './components/Listings/Listings'
import CreateListing from './components/Listings/CreateListing'
import EditListing from './components/Listings/EditListing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './api/AuthContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/App.css'
import Inbox from './components/Messages/Inbox'
import SendMessage from './components/Messages/SendMessage'


const App = () => {
  const { user, authenticated, setUser, setAuthenticated, loading } = useContext(AuthContext)

  const navigate = useNavigate()
  
    // Logout handler
    const handleLogout = () => {
      setUser(null)
      setAuthenticated(false)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
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
        {/* Home Page: Displays Listings */}
        <Route path="/" element={<Listings user={user} authenticated={authenticated} />} />

        {/* User Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Create and Edit Listings */}
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



        {/* Catch-All Route for Invalid URLs */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
