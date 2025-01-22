const Message = require('../models/Message')
const User = require('../models/User')
const Listing = require('../models/Listing')


const createMessage = async (req, res) => {
  try {
    const { receiverId, listingId, content } = req.body
    const senderId = req.user?._id

    if (!senderId) {
      return res.status(400).json({ message: 'Sender ID is required.' })
    }

    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }

    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

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
    console.error('Error in createMessage:', error.message)
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

const getAllMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const messages = await Message.find({receiverId: userId})
      .populate('senderId', 'username email')
      .populate('receiverId', 'username email')
      .populate('listingId', 'title description')
      .sort({ createdAt: -1 })

    res.status(200).json({ data: messages })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages.', error: error.message })
  }
}


const getMessagesByListingId = async (req, res) => {
  const { listingId } = req.params

  try {
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


const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { content } = req.body

    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' })
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized.' })
    }

    message.content = content || message.content
    await message.save()

    res.status(200).json({ message: 'Message updated successfully.', data: message })
  } catch (error) {
    res.status(500).json({ message: 'Error updating message.', error: error.message })
  }
}

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

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