import mongoose from 'mongoose';
const {Schema} = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    }],
},
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);
module.exports = User;