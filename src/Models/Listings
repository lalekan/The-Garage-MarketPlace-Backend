import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
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
        type: [{type: objectId, ref: Users}],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Listing', listingSchema);
module.exports = Listing;
