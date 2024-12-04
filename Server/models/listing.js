import mongoose from 'mongoose';
const { Schema } = mongoose;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: int,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    author: {
        type: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    },
    messages: {
        type: [{type: mongoose.Schema.ObjectId, ref: 'Message'}],
        required: true
    }
    }, 
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Listing', listingSchema);
module.exports = Listing;
