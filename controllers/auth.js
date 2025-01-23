const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const  User = require('../models/User')
const middleware = require('../middleware/auth')

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' })
    }

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    })
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' })
    }

    // Hash password
    const hashedPassword = await middleware.hashPassword(password)

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
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

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' })
    }

    // Find user by username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = await middleware.comparePassword(user.password, password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Create JWT payload
    const payload = { id: user._id, username: user.username }

    // Create Access Token + Refresh Token
    const authToken = middleware.createToken(payload)
    const refreshToken = middleware.createRefreshToken(payload)

    // Return user + tokens
    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: authToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server Error', error: error.message })
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
  try {
    const user = await User.findById(req.user.id).select('username email')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Error checking session', error: err.message })
  }
}


// Refresh token endpoint
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = { registerUser, loginUser, updateUserProfile, updatePassword, checkSession, createRefreshToken }
