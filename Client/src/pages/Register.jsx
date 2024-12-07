import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
  
    const data = {
      username: username, // assume 'username' is the value from the form
      email: email, // assume 'email' is the value from the form
      password: password, // assume 'password' is the value from the form
      confirmPassword: confirmPassword, // assume 'confirmPassword' is the value from the form
    }
  
    try {
      const response = await axios.post('/auth/register', data)
      console.log('User registered successfully:', response.data)
      navigate('/login')
    } catch (error) {
      if (error.response) {
        console.log('Error:', error.response.data) // Check error message from the backend
      }
    }
  }
  

  return (
    <div>
      <h1>Register</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}


export default Register
