const express = require('express')
const {verifyToken} = require('../middleware/auth')
const User = require('../models/user')
const Listing = require('../models/listing')

const router = express.Router()

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('listings')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update User Profile
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email } = req.body
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.username = username || user.username
    user.email = email || user.email
    await user.save()

    res.json({ message: 'Profile updated successfully', user })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get User's Listing History
router.get('/listings', verifyToken, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.userId })
    res.json(listings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Protected route to create a new listing (only authenticated users can create listings)
router.post('/listing', verifyToken, async (req, res) => {
    try {
      const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        seller: req.user._id,
      })
  
      await newListing.save()
      res.status(201).json({ message: 'Listing created successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  })

module.exports = router
