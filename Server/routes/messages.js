const express = require('express')
const { authMiddleware } = require('../controllers/auth')
const { editMessage, deleteMessage } = require('../controllers/message')
const Message = require('../models/message')
const Listing = require('../models/listing')
const mongoose = require('mongoose')

const router = express.Router()

// Send Message about a Listing
router.post('/:listingId/send', authMiddleware, async (req, res) => {
  const { content } = req.body
  const { listingId } = req.params

  try {
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ message: 'Invalid listing ID' })
    }

    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    const receiverId = listing.author
    const senderId = req.user.userId

    // Create and save the new message
    const newMessage = new Message({
      content,
      senderId,
      receiverId,
      listing: listingId,
    })
    await newMessage.save()

    // Add the message to the listing's messages
    listing.messages.push(newMessage._id)
    await listing.save()

    res.status(201).json({ message: 'Message sent successfully', newMessage })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get Messages related to a Listing
router.get('/:listingId/messages', authMiddleware, async (req, res) => {
  const { listingId } = req.params

  try {
    const listing = await Listing.findById(listingId).populate('messages')
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    res.json(listing.messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get All Messages for a User
router.get('/inbox', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
    }).populate('sender receiver listing')

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Edit a Message
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' })
    }

    // Find message and ensure the user is authorized to edit
    const message = await Message.findById(id)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit messages you sent' })
    }

    // Update content
    message.content = content
    await message.save()

    res.json({ message: 'Message updated successfully', message })
  } catch (error) {
    console.error('Error editing message:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a Message (Soft Delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  try {
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' })
    }

    // Find message and ensure the user is authorized to delete
    const message = await Message.findById(id)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }
    if (
      message.senderId.toString() !== req.user._id.toString() &&
      message.receiverId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'You can only delete messages you are part of' })
    }

    // Implement soft delete by adding user ID to deletedBy array
    if (!message.deletedBy.includes(req.user._id.toString())) {
      message.deletedBy.push(req.user._id)
      await message.save()
      res.json({ message: 'Message deleted successfully' })
    } else {
      res.status(400).json({ message: 'Message already deleted' })
    }
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
