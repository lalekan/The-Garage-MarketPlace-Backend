// src/pages/Register.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterUser } from '../api/Auth'
import '../styles/Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const { username, email, password, confirmPassword } = formData
  
    // Validate form inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
  
    try {
      setIsLoading(true)
      // Call the API to register the user
      const response = await RegisterUser({ username, email, password, confirmPassword })
      console.log('Registration successful:', response)
  
      // Redirect to login or home page
      navigate('/login')
    } catch (err) {
      console.error('Error during registration:', err)
      setError(err.response?.data?.message || 'An error occurred during registration.')
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register
