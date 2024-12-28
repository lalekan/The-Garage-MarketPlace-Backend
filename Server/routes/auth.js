const router = require('express').Router()
const controller = require('../controllers/auth')
const middleware = require('../middleware/auth')
const User = require('../models/user')


// User login
router.post('/login', controller.loginUser)

// User registration
router.post('/register', controller.registerUser)

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
