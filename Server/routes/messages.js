const express = require('express')
const {
  createMessage,
  getAllMessages,
  getMessagesByListingId,
  updateMessage,
  deleteMessage,
} = require('../controllers/message')
const { verifyToken } = require('../middleware/auth')
const router = express.Router()

// Create a new message
router.post('/send', verifyToken, createMessage)

// Get all messages
router.get('/', verifyToken, getAllMessages)

// Get messages for a specific listing
router.get('/listing/:listingId', verifyToken, getMessagesByListingId)

// Update a message
router.put('/:messageId', verifyToken, updateMessage)

// Delete a message
router.delete('/:messageId', verifyToken, deleteMessage)

module.exports = router
