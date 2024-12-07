const Listing = require('../models/listing')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Create New Listing
const createListing = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1] // Remove 'Bearer ' prefix

        if (!token) {
        return res.status(400).json({ error: 'Authorization token is missing.' })
        }

        // Decode the token to get the user data (seller ID)
        const decoded = jwt.decode(token) // Decode without verifying for now (just to get the payload)

        if (!decoded || !decoded._id) {
        return res.status(400).json({ error: 'Invalid token or seller ID is missing.' })
        }

        const seller = decoded._id // Extract sellerId from the decoded token

      const { title, description, price } = req.body
  
      if (!seller) {
        return res.status(400).json({ error: 'Seller ID is missing.' })
      }
  
      const newListing = new Listing({
        title,
        description,
        price,
        seller: seller, 
      })
  
      await newListing.save()
      res.status(201).json({ message: 'Listing created successfully!', listing: newListing })
    } catch (error) {
      console.error('Error creating listing:', error)
      res.status(400).json({ error: error.message })
    }
  }
  
  

// Get All Listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller', 'username')
    res.json(listings)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get Single Listing by ID
const getListing = async (req, res) => {
  const { id } = req.params
  try {
    const listing = await Listing.findById(id).populate('seller', 'username')
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    res.json(listing)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update Listing (for Sellers Only)
const updateListing = async (req, res) => {
  const { id } = req.params
  const { title, description, price } = req.body

  try {
    const listing = await Listing.findById(id)

    if (!listing || String(listing.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    listing.title = title || listing.title
    listing.description = description || listing.description
    listing.price = price || listing.price

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
      listing.images = imagePaths
    }

    await listing.save()
    res.json({ message: 'Listing updated successfully', listing })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete Listing (for Sellers Only)
const deleteListing = async (req, res) => {
  const { id } = req.params
  try {
    const listing = await Listing.findById(id)

    if (!listing || String(listing.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await listing.remove()
    res.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createListing, getAllListings, getListing, updateListing, deleteListing }
