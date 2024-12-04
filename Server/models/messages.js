import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Message', messageSchema);
module.exports = Listing;
