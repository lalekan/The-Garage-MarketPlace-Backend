const mongoose = require('mongoose')
const User = require('./User')
const Listing = require('./Listing')


const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing', 
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
