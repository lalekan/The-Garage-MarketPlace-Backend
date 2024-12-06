const mongoose = require('mongoose')
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
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    author: {
        type: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    },
    messages: {
        type: [{type: mongoose.Schema.ObjectId, ref: 'Message'}],
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    }, 
    {
        timestamps: true
    }
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
