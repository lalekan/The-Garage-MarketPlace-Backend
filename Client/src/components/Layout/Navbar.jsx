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
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="https://www.nicepng.com/png/full/521-5216553_png-file-svg-garage-door.png" alt="Garage Door Logo" className="navbar-logo-img" />
          <Link to="/" className="navbar-title">
            The Garage Marketplace
          </Link>
        </div>
        {authenticated && user && (
          <p className="navbar-welcome">Welcome, {user.username}</p>
        )}
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        {authenticated ? (
          <>
            <Link to="/messages">Messages</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
