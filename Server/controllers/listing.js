const Listing = require('../models/listing')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')


// Create a new listing
const createListing = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => file.path) : []
    const { title, description, price } = req.body

    const newListing = new Listing({
      title,
      description,
      price,
      images,
      userId: req.user.id,
    })

    await newListing.save()
    res.status(201).json(newListing)
  } catch (err) {
    res.status(500).json({ message: 'Error creating listing', error: err.message })
  }
}

// Get all listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('userId', 'username _id')
      .sort({ createdAt: -1 }) 
    res.status(200).json(listings)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings', error: err.message })
  }
}


  

// Get a single listing by ID
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('userId', 'username')
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    res.status(200).json(listing)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listing', error: err.message })
  }
}

// Update a listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this listing' })
    }

    // Handle updated fields
    const { title, description, price } = req.body
    if (title) listing.title = title
    if (description) listing.description = description
    if (price) listing.price = price

    // Handle new images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path)
      listing.images = imagePaths
    }

    await listing.save()
    res.status(200).json(listing)
  } catch (err) {
    res.status(500).json({ message: 'Error updating listing', error: err.message })
  }
}

const deleteListing = async (req, res) => {
    try {
      const { id } = req.params
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid listing ID' })
      }
  
      const listing = await Listing.findById(id)
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' })
      }
  
      if (listing.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this listing' })
      }
  
      // Remove the listing
      await Listing.deleteOne({ _id: id })
  
      res.status(200).json({ message: 'Listing deleted successfully' })
    } catch (err) {
      console.error('Error deleting listing:', err.message)
      res.status(500).json({ message: 'Error deleting listing', error: err.message })
    }
  }

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
}
