const router = require('express').Router()
const controller = require('../controllers/auth')
const middleware = require('../middleware/auth')
const User = require('../models/user')


// User login
router.post('/login', controller.loginUser)

// User registration
router.post('/register', controller.registerUser)

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' })
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
      const newAuthToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })
      res.status(200).json({ token: newAuthToken })
    } catch (err) {
      res.status(401).json({ message: 'Invalid refresh token' })
    }
  })
  
  
  
  

// Update User Profile
router.put(
    '/update/profile/:user_id',
    middleware.stripToken,
    middleware.verifyToken,
    controller.updateUserProfile
)
  
// Update User Password
router.put(
    '/update/password/:user_id',
    middleware.stripToken,
    middleware.verifyToken,
    controller.updatePassword
  )

// Check session
router.get(
  '/check-session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkSession
)

module.exports = router
