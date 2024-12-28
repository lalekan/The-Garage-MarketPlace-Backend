const Listing = require('../models/listing')

// Create a new listing
const createListing = async (req, res) => {
    const { title, description, price } = req.body
    const userId = req.user._id // Assuming user is authenticated
  
    // Validate if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' })
    }
  
    // Get the image paths from Multer
    const imagePaths = req.files.map(file => file.path)
  
    try {
      const newListing = new Listing({
        userId,
        title,
        description,
        price,
        images: imagePaths,
      })
  
      await newListing.save()
  
      res.status(201).json({
        message: 'Listing created successfully',
        newListing,
      })
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message })
    }
  }
  

// Get all listings
const getAllListings = async (req, res) => {
    try {
      const listings = await Listing.find()
      res.status(200).json(listings)
    } catch (error) {
        console.error('Error fetching listings:', error)
      res.status(500).json({ message: 'Error fetching listings.', error: error.message })
    }
  }

// Get a specific listing by ID
const getListingById = async (req, res) => {
    try {
      const { id } = req.params
      const listing = await Listing.findById(id)
  
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found.' })
      }
  
      res.status(200).json({ listing })
    } catch (error) {
      res.status(500).json({ message: 'Error fetching listing.', error: error.message })
    }
  }

// Update a listing by ID
const updateListing = async (req, res) => {
    try {
      const { id } = req.params
      const { title, description, price } = req.body // Get updated data from the request body
  
      // Make sure the listing exists
      const listing = await Listing.findById(id) // Mongoose method to find listing by ID
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found.' })
      }
  
      // Check if the logged-in user is the owner of the listing
      if (listing.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized action.' })
      }
  
      // Update listing fields
      listing.title = title || listing.title
      listing.description = description || listing.description
      listing.price = price || listing.price
  
      // Handle image update (add new images if provided)
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path) // Get image paths from Multer
        listing.images = [...listing.images, ...newImages] // Merge old and new images
      }
  
      // Save updated listing
      await listing.save()
  
      res.status(200).json({ message: 'Listing updated successfully.', listing })
    } catch (error) {
      console.error("Error updating listing:", error)
      res.status(500).json({ message: 'Server Error', error: error.message })
    }
  }
  

// Delete a listing by ID
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params

    const listing = await Listing.findByPk(id)

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' })
    }

    // Check if the logged-in user owns the listing
    if (listing.userId !== req.user._id) {
      return res.status(403).json({ message: 'You are not authorized to delete this listing.' })
    }

    await listing.destroy()
    res.status(200).json({ message: 'Listing deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing.', error: error.message })
  }
}

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
}
