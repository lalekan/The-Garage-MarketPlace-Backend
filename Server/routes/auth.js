const express = require('express')
const {registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount  } = require('../controllers/auth')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// POST /register
router.post('/register', registerUser)

// POST /login
router.post('/login', loginUser)

// Fetch user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile)

// Update user profile (protected route)
router.put('/profile', authMiddleware, updateUserProfile);

// Delete user account (protected route)
router.delete('/profile', authMiddleware, deleteUserAccount);

module.exports = router
