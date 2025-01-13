const router = require('express').Router()
const controller = require('../controllers/auth')
const middleware = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// User registration
router.post('/register', controller.registerUser)

// User login
router.post('/login', controller.loginUser)

// Refresh Token
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body
  
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' })
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
  
      const newAuthToken = jwt.sign(
        { id: decoded.id, username: decoded.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
  
      res.status(200).json({ token: newAuthToken })
    } catch (err) {
      res.status(401).json({ message: 'Invalid refresh token' })
    }
  })

// Check session
router.get(
  '/check-session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkSession
)

module.exports = router
