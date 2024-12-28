const express = require('express')
const {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require('../controllers/message')
const {verifyToken} = require('../middleware/auth')
const router = express.Router()

router.post('/send', verifyToken, createMessage)
router.get('/listing/:listingId', verifyToken, getAllMessages)
router.get('/:messageId', verifyToken, getMessageById)
router.put('/:messageId', verifyToken, updateMessage)
router.delete('/:messageId', verifyToken, deleteMessage)

module.exports = router
