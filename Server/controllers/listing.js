const Listing = require('../models/listing')
const User = require('../models/user')

// Create New Listing
const createListing = async (req, res) => {
  const { title, description, price, images } = req.body
  try {
    const newListing = new Listing({
      title,
      description,
      price,
      images,
      seller: req.user.userId,
    })

    await newListing.save()
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { listings: newListing._id },
    })

    res.status(201).json({ message: 'Listing created successfully', listing: newListing })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get All Listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller', 'username')
    res.json(listings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
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
    res.status(500).json({ message: 'Server error' })
  }
}

// Update Listing (for Listers Only)
const updateListing = async (req, res) => {
  const { id } = req.params
  const { title, description, price, images } = req.body
  try {
    const listing = await Listing.findById(id)
    if (!listing || String(listing.seller) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    listing.title = title || listing.title
    listing.description = description || listing.description
    listing.price = price || listing.price
    listing.images = images || listing.images

    await listing.save()
    res.json({ message: 'Listing updated successfully', listing })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete Listing (for Listers Only)
const deleteListing = async (req, res) => {
  const { id } = req.params
  try {
    const listing = await Listing.findById(id)
    if (!listing || String(listing.seller) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await listing.remove()
    res.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createListing, getAllListings, getListing, updateListing, deleteListing }
