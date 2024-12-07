const express = require('express')
const multer = require('multer')
const path = require('path')
const { createListing, getAllListings, getListing, updateListing, deleteListing } = require('../controllers/listing')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

// Routes
router.post('/create', authMiddleware, upload.array('images', 5), createListing)
router.get('/', getAllListings)
router.get('/:id', getListing)
router.put('/:id', authMiddleware, upload.array('images', 5), updateListing)
router.delete('/:id', authMiddleware, deleteListing)

module.exports = router
