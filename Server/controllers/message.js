const Message = require('../models/message')
const User = require('../models/user') 

// Create a new message
const createMessage = async (req, res) => {
    const { receiverId, listingId, content } = req.body
  
    try {
      const senderId = req.user._id
  
      // Check if the listing exists
      const listing = await Listing.findById(listingId)
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' })
      }
  
      // Check if the receiver exists
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

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.status(200).json({ data: messages })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages.', error: error.message })
  }
}

// Get a single message by listing ID
const getMessageById = async (req, res) => {
    const { listingId } = req.params
  
    try {
      // Fetch messages related to the given listing
      const messages = await Message.find({ listingId })
        .populate('senderId', 'name email') // Populate sender info
        .populate('receiverId', 'name email') // Populate receiver info
        .populate('listingId', 'title description') // Populate listing info
  
      if (messages.length === 0) {
        return res.status(404).json({ message: 'No messages found for this listing' })
      }
  
      res.status(200).json({ messages })
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message })
    }
  }

// Update a message
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const message = await Message.findByPk(id)

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' })
    }

    message.content = content || message.content

    await message.save()
    res.status(200).json({ message: 'Message updated successfully.', data: message })
  } catch (error) {
    res.status(500).json({ message: 'Error updating message.', error: error.message })
  }
}

// Delete a message (if the user is the sender)
const deleteMessage = async (req, res) => {
    const { messageId } = req.params
  
    try {
      const message = await Message.findById(messageId)
      
      if (!message) {
        return res.status(404).json({ message: 'Message not found' })
      }
  
      // Ensure the logged-in user is the sender
      if (message.senderId.toString() !== req.user._id) {
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
  getMessageById,
  updateMessage,
  deleteMessage,
}
