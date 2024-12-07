const Message = require('../models/message')

const editMessage = async (req, res) => {
    try {
      const { id } = req.params
      const { content } = req.body
  
      // Find the message
      const message = await Message.findById(id)
      if (!message) {
        return res.status(404).json({ message: 'Message not found' })
      }
  
      // Check if the requester is the sender
      if (message.senderId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit messages you sent' })
      }
  
      // Update the message content
      message.content = content
      await message.save()
  
      return res.status(200).json({ message: 'Message updated successfully', updatedMessage: message })
    } catch (error) {
      console.error('Error editing message:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params
  
      // Find the message
      const message = await Message.findById(id)
      if (!message) {
        return res.status(404).json({ message: 'Message not found' })
      }
  
      // Check if the requester is the sender or the receiver
      if (message.senderId.toString() !== req.user.id && message.receiverId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only delete messages you sent or received' })
      }
  
      // Implement soft delete by adding user ID to deletedBy array
      if (!message.deletedBy.includes(req.user.id)) {
        message.deletedBy.push(req.user.id)
        await message.save()
        return res.status(200).json({ message: 'Message deleted successfully' })
      } else {
        return res.status(400).json({ message: 'Message already deleted' })
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
}
  

module.exports = {editMessage, deleteMessage}