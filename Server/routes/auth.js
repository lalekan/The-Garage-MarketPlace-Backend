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
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required' })
        }

        const decoded = await middleware.verifyRefreshToken(refreshToken)
        const newAuthToken = middleware.createToken({ id: decoded.id, email: decoded.email })

        res.status(200).json({ token: newAuthToken })
    } catch (error) {
        res.status(403).json({ message: error.message })
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
