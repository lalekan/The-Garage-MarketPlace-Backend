const router = require('express').Router()
const controller = require('../controllers/auth')
const middleware = require('../middleware/auth')

router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)
router.put(
  '/update/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updatePassword,
  controller.updateUserProfile
)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkSession
)

module.exports = router