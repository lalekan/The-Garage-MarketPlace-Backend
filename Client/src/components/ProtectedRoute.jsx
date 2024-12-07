import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />  // Redirect to login if not authenticated
  }

  return children
}

export default ProtectedRoute
