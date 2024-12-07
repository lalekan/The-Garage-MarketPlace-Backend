import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ErrorPage from "./pages/ErrorPage"
import ListingsList from "./components/Listings/ListingList"
import ListingDetail from "./components/Listings/ListingDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import EditListing from "./components/Listings/EditListing"
import CreateListing from "./components/Listings/CreateListing"
import { fetchListings } from "./api/listings"
import { CheckSession } from "./api/Auth"
import './styles/App.css'
import './styles/index.css'


const App = () => {
  const [authenticated, toggleAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [passwordUpdate, setPasswordUpdate] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [listing, setListing] = useState({})
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nonUser, setNonUser] = useState({
    username: '',
    bio: '',
  })

  // Universal API call for entire app
  let apiUrl = 'http://localhost:3000/api'


  // Check if token exists in localStorage when app loads
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch listings from the API
  useEffect(() => {
    const getListings = async () => {
      try {
        const data = await fetchListings()
        setListings(data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch listings')
        setLoading(false)
      }
    }

    getListings()
  }, [])

  if (loading) return <div>Loading listings...</div>
  if (error) return <div>{error}</div>

  // const handleLogin = (token) => {
  //   localStorage.setItem("authToken", token)
  //   setIsAuthenticated(true)
  //   window.location.href = "/"
  // }

  const handleLogout = () => {
    setPilgrim(null) //Once logged out, the user no longer has user priviledges
    toggleAuthenticated(false) // Once logged out, the user is no longer authenticated
    localStorage.clear()
  }

    // Check each time if the user is a pilgrim and authenticated to make certain commands
    const checkToken = async () => {
      const user = await CheckSession()
      setUser(user)
      toggleAuthenticated(true)
    }

    // Verify token
    useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <Router>
      <Navbar isAuthenticated={authenticated} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home isAuthenticated={authenticated} />} />
        <Route path="/login" element={<Login setUser={setUser} onLogin={toggleAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />

        <Route path="/listings" element={<ListingsList user={user} listings={listings} />} />
        <Route path="/listings/:id" element={<ListingDetail listing={listing} user={user} setListing={setListing} />} />

        <Route
          path="/create-listing/:sellerId"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
