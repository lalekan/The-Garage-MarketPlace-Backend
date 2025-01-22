const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String, maxlength: 500 },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true })

userSchema.index({ email: 1 })

const User = mongoose.model('User', userSchema)
module.exports = User
