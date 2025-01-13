import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../api/AuthContext'
import '../../styles/Navbar.css'

const Navbar = () => {
  const { user, authenticated, setAuthenticated, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    setAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">The Garage Marketplace</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {authenticated && <Link to="/messages">Messages</Link>}
        {authenticated ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
