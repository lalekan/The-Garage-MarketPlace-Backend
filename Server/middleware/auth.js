const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
const comparePassword = async (hashedPassword, plainPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Create JWT token
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// Create Refresh Token
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }) // 7-day validity
}

// Helper function to strip the token from the Authorization header
const stripToken = (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header) throw new Error('Authorization header missing')

    if (!header.startsWith('Bearer ')) throw new Error('Invalid authorization header format')

    const token = header.split(' ')[1]
    req.token = token
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Authorization header missing or invalid', error: error.message })
  }
}

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  console.log('Token from request:', req.token) // Debug log
  jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Verification Error:', err) // Debug log
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
    req.user = decoded
    next()
  })
}



  
  module.exports = {
    stripToken,
    hashPassword,
    comparePassword,
    createToken,
    verifyToken,
    createRefreshToken
  }