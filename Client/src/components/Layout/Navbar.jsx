import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Call the onLogout function passed from App to handle logout logic
    onLogout()
    navigate('/login')  // Redirect to the login page after logout
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {/* Conditionally render the logout button if the user is authenticated */}
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li> {/* Example: Profile link */}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
