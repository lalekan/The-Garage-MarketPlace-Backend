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
    const { username, password, confirmPassword, email, image, bio } = req.body

    // Validate required fields
    if (!validateFields({ username, password, confirmPassword, email }, res)) return

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Ensure User model is defined and imported correctly
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Hash password
    const hashedPassword = await middleware.hashPassword(password)

    // Create new user
    const newUser = new User({ username, password: hashedPassword, email, image, bio })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error("Error in registerUser:", error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}



// Login User
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user || !(await middleware.comparePassword(user.password, req.body.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload = { id: user._id, email: user.email }
    const authToken = middleware.createToken(payload)
    const refreshToken = middleware.createRefreshToken(payload)

    res.status(200).json({
      user: { id: user._id, email: user.email, name: user.name },
      token: authToken,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message })
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
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    if (!user) return res.status(401).json({ message: 'User not found' })
    
    res.json({ user }) // Return the user if valid
  } catch (err) {
    res.status(401).json({ message: 'Session expired' })
  }
}

// Refresh token endpoint
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = { registerUser, loginUser, updateUserProfile, updatePassword, checkSession, createRefreshToken }
