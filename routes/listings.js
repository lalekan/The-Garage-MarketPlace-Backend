const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const controller = require('../controllers/listing')
const middleware = require('../middleware/auth')

// CRUD routes
router.post('/', middleware.verifyToken, upload.array('images', 5), controller.createListing)
router.get('/', controller.getAllListings)
router.get('/:id', controller.getListingById)
router.put('/:id', middleware.verifyToken, upload.array('images', 5), controller.updateListing)
router.delete('/:id', middleware.verifyToken, controller.deleteListing)

module.exports = router
