const express = require('express')
const authRoutes = require('./auth')
const listingRoutes = require('./listings')
const messageRoutes = require('./messages')
const userRoutes = require('./users')

const router = express.Router()

// Route groups
router.use('/auth', authRoutes)
router.use('/listings', listingRoutes)
router.use('/messages', messageRoutes)
router.use('/users', userRoutes)

module.exports = router
