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
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }) 
}

// Helper function to strip token from Authorization header
const stripToken = (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header) throw new Error('Authorization header missing')

    if (!header.startsWith('Bearer ')) throw new Error('Invalid authorization header format')

    const token = header.split(' ')[1]

    req.token = token
    next()
  } catch (error) {
    console.error('Error in stripToken middleware:', error.message)
    return res.status(401).json({ message: 'Authorization header missing or invalid', error: error.message })
  }
}


// Helper function to verify the token from the Authorization header
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] 
    if (!token) throw new Error('Token missing')

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) throw new Error('Invalid or expired token')
      req.user = decoded 
      next()
    })
  } catch (error) {
    console.error('Token error:', error.message)
    res.status(401).json({ message: 'Unauthorized', error: error.message })
  }
}

  module.exports = {
    stripToken,
    hashPassword,
    comparePassword,
    createToken,
    verifyToken,
    createRefreshToken
  }