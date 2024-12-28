import { Link } from "react-router-dom"
import '../../styles/Navbar.css'

const Navbar = ({ isAuthenticated, user, onLogout, onLogin }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">The Garage Marketplace</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/listings">Listings</Link>
            </li>
            <li>
              <button onClick={onLogout} className="logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
