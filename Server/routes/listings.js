const express = require('express')
const router = express.Router()
const multer = require('multer')
const controller = require('../controllers/listing')
const middleware = require('../middleware/auth')
const Listing = require('../models/listing')

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const upload = multer({ storage })

// CRUD routes
router.post('/', middleware.verifyToken, upload.array('images', 5), controller.createListing)
router.get('/', controller.getAllListings)
router.get('/:id', controller.getListingById)
router.put('/:id', middleware.verifyToken, upload.array('images', 5), controller.updateListing)
router.delete('/:id', middleware.verifyToken, controller.deleteListing)

module.exports = router
