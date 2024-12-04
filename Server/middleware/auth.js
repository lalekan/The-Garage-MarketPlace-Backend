const express = require('express')
const { authMiddleware } = require('../controllers/auth')
const Listing = require('../models/listing')

const router = express.Router()

// Protected route to create a new listing (allow only authenticated users to create listings)
router.post('/listing', authMiddleware, async (req, res) => {
  try {
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      author: req.user.userId, 
    })

    await newListing.save()
    res.status(201).json({ message: 'Listing created successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
