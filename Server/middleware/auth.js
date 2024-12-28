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

// Helper function to strip the token from the Authorization header
const stripToken = (req, res, next) => {
    try {
      const header = req.headers['Authorization']
      if (!header) throw new Error('Authorization header is missing.')
  
      if (!header.startsWith('Bearer ')) throw new Error('Invalid authorization header format.')
  
      const token = header.split(' ')[1]
      req.token = token // Attach token to the request object
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Authorization header is missing or invalid', error: error.message })
    }
  }
  
  

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' }) // Handles expired token
    }

    req.user = decoded // Save decoded user data to request for use in other routes
    next()
  })
} 

module.exports = { stripToken, hashPassword, comparePassword, createToken, verifyToken }
