// controllers/message.js

const Message = require('../models/message')
const User = require('../models/user')
const Listing = require('../models/listing')


const createMessage = async (req, res) => {
  const { receiverId, listingId, content } = req.body

  try {
    const senderId = req.user._id

    // Check if listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    // Create the message
    const newMessage = new Message({
      senderId,
      receiverId,
      listingId,
      content,
    })
    await newMessage.save()

    res.status(201).json({
      message: 'Message sent successfully',
      newMessage,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

/**
 * Get all messages (optional or admin use)
 * @route GET /api/messages
 */
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'username email')
      .populate('receiverId', 'username email')
      .populate('listingId', 'title description')
      .sort({ createdAt: -1 })

    res.status(200).json({ data: messages })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages.', error: error.message })
  }
}

/**
 * Get all messages for a particular listing
 * @route GET /api/messages/listing/:listingId
 */
const getMessagesByListingId = async (req, res) => {
  const { listingId } = req.params

  try {
    // Fetch messages for the given listing
    const messages = await Message.find({ listingId })
      .populate('senderId', 'username email')
      .populate('receiverId', 'username email')
      .populate('listingId', 'title description')
      .sort({ createdAt: -1 })

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this listing' })
    }

    res.status(200).json({ messages })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

/**
 * Update a message by _id
 * @route PUT /api/messages/:messageId
 */
const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { content } = req.body

    // In Mongoose:
    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' })
    }

    // Optionally check if the current user is the sender
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized.' })
    }

    // Update the content
    message.content = content || message.content
    await message.save()

    res.status(200).json({ message: 'Message updated successfully.', data: message })
  } catch (error) {
    res.status(500).json({ message: 'Error updating message.', error: error.message })
  }
}

/**
 * Delete a message by _id (sender only)
 * @route DELETE /api/messages/:messageId
 */
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    // Ensure the logged-in user is the sender
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this message' })
    }

    await message.remove()
    res.status(200).json({ message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessagesByListingId,
  updateMessage,
  deleteMessage,
}