const mongoose = require('mongoose')
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    deletedBy: { type: Array, default: [] },
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
