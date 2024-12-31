const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const  User = require('../models/user')
const middleware = require('../middleware/auth')

// Helper function for validation
const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ message: `${key} is required` })
      return false
    }
  }
  return true
}

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' })
    }

    // Hash the password
    const hashedPassword = await middleware.hashPassword(password)

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Error during registration', error: error.message })
  }
}



// Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user || !(await middleware.comparePassword(user.password, password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload = { id: user._id, username: user.username }
    const authToken = middleware.createToken(payload)
    const refreshToken = middleware.createRefreshToken(payload)

    res.status(200).json({ user, token: authToken, refreshToken })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update User Profile and Password
const updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.params
    const { username, email, image, bio } = req.body

    if (user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action.' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { username, email, image, bio },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error in updateUserProfile:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update User Password
const updatePassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const { user_id } = req.params

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    const hashedPassword = await middleware.hashPassword(password)
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { password: hashedPassword },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ message: 'Password updated successfully', user: updatedUser })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Check session
const checkSession = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] // Get the token from the Authorization header
  console.log('Token received in checkSession:', token) // Debug log
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'User not found' })

    res.json({ user }) // Return the user if valid
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired' })
    }
    res.status(401).json({ message: 'Invalid token' })
  }
}



// Refresh token endpoint
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = { registerUser, loginUser, updateUserProfile, updatePassword, checkSession, createRefreshToken }
