const express = require('express')
const upload = require('../middleware/multer')
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} = require('../controllers/listing')
const {verifyToken} = require('../middleware/auth')

const router = express.Router()

// Create a new listing with image upload
router.post('/', verifyToken, upload.array('images', 5), createListing)

// Get all listings
router.get('/', getAllListings)

// Get a specific listing by ID
router.get('/:id', getListingById)

// Update a listing by ID
router.put('/:id', verifyToken, upload.array('images', 5), updateListing)

// Delete a listing by ID
router.delete('/:id', verifyToken, deleteListing)

module.exports = router
