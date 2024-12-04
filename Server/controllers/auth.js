const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET

// User Registration - POST /register
const registerUser = async (req, res) => {
  const { username, password, email } = req.body

  try {
    // Check if duplicate user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    })

    // Save new user to db
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// User Login - POST /login
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user already exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      username: user.username,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    res.json({ message: 'Login successful', token })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Middleware to protect routes - Verifying JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { registerUser, loginUser, authMiddleware }
