import { useState, useEffect, useContext } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import { AuthContext } from "./api/AuthContext"
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ErrorPage from "./pages/ErrorPage"
import ListingList from "./components/Listings/ListingList"
import ListingDetail from "./components/Listings/ListingDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import EditListing from "./components/Listings/EditListing"
import CreateListing from "./components/Listings/CreateListing"
import { CheckSession } from "./api/Auth"
import './styles/App.css'
import './styles/index.css'

const App = () => {
  // const [authenticated, toggleAuthenticated] = useState(false)
  // const [user, setUser] = useState(null)
  // const [loading, setLoading] = useState(true) 
  // const [listing, setListing] = useState({}) // Listing data
  // const [listings, setListings] = useState([]) // Listings data
  // const [error, setError] = useState(null) // Error handling
  // const [nonUser, setNonUser] = useState({ username: '', bio: '' }) // Non-user data (possibly a guest view)
  // const [passwordUpdate, setPasswordUpdate] = useState(null) // Password update tracking
  // const [newPassword, setNewPassword] = useState('') // New password
  // const [confirmNewPassword, setConfirmNewPassword] = useState('') 

  const { user, authenticated, setUser, setAuthenticated, loading } = useContext(AuthContext)
  // console.log(user, authenticated, setUser, setAuthenticated, loading, "USER, AUTHENTICATED, SETUSER, SETAUTHENTICATED, LOADING")


  const navigate = useNavigate() // Using useNavigate here for navigation

  // Check token function
  // const checkToken = async () => {
  //   const token = localStorage.getItem('authToken')
  //   if (!token) {
  //     console.log('No token found')
  //     setUser(null)
  //     toggleAuthenticated(false)
  //     setLoading(false)
  //     return
  //   }

  //   try {
  //     console.log('Token retrieved:', token)
  //     const userData = await CheckSession() // Validate token and retrieve user info
  //     console.log('User data from CheckSession:', userData)
  //     setUser(userData.user) // Assuming user data is returned
  //     toggleAuthenticated(true) // Set authenticated to true
  //   } catch (err) {
  //     console.error('Error during session check:', err.message)
  //     if (err.message === 'Session expired') {
  //       localStorage.removeItem('authToken') // Clear invalid token
  //       setUser(null)
  //       toggleAuthenticated(false)
  //       navigate('/login') // Redirect to login page
  //     }
  //     setUser(null)
  //     toggleAuthenticated(false)
  //     localStorage.removeItem('authToken') // Clear invalid token
  //   } finally {
  //     setLoading(false) // End loading after session check
  //   }
  // }

  // useEffect(() => {
  //   checkToken() // Check token on initial load
  // }, [])

  // useEffect(() => {
  //   if (!authenticated) {
  //     setUser(null)
  //     setAuthenticated(false)
  //     localStorage.removeItem('authToken')
  //   }
  // }, [authenticated])
  
  // Login handler
  // const handleLogin = async (username, password) => {
  //   try {
  //     const response = await loginUser({ username, password })
  //     const { token } = response.data
  
  //     // Store the token securely
  //     localStorage.setItem('authToken', token)
  
  //     setUser(response.data.user)
  //     toggleAuthenticated(true) // Set authenticated state to true
  //   } catch (error) {
  //     console.error('Login failed:', error.response?.data || error.message)
  //   }
  // }

  // Logout handler
  const handleLogout = () => {
    setAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }
  

  // Display a loading screen while checking session
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    // <>
    //   <Navbar 
    //     isAuthenticated={authenticated}
    //     user={user}
    //     // onLogout={handleLogout}
    //   />
    //   <Routes>
    //     <Route 
    //       path="/"
    //       element={
    //         <Home 
    //           isAuthenticated={authenticated}
    //         />
    //       } 
    //     />
    //     <Route
    //       path="/login" 
    //       element={
    //         <Login 
    //           setUser={setUser}
    //           // onLogin={toggleAuthenticated} 
    //         />
    //       }
    //     />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="*" element={<ErrorPage />} />
    //     <Route path="/listings" element={<ListingList user={user} />} />
    //     <Route path="/listings/:id" element={<ListingDetail listing={listing} user={user} 
    //     // setListing={setListing}
    //     />} />
    //     <Route
    //       path="/create-listing/"
    //       element={
    //         <ProtectedRoute isAuthenticated={authenticated}>
    //           <CreateListing />
    //         </ProtectedRoute>
    //       }
    //     />
    //     <Route
    //       path="/listings/:id/edit"
    //       element={
    //         <ProtectedRoute isAuthenticated={authenticated} user={user}>
    //           <EditListing user={user} />
    //         </ProtectedRoute>
    //       }
    //     />
    //   </Routes>
    //   <Footer />
    // </>
<>
      <Navbar isAuthenticated={authenticated} user={user} onLogout={handleLogout}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/listings" element={<ListingList user={user} />} />
        <Route path="/listings/:id" element={<ListingDetail user={user} />} />
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
              <EditListing user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
