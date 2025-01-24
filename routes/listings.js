const express = require('express')
const router = express.Router()
const controller = require('../controllers/listing')
const middleware = require('../middleware/auth')

// CRUD routes
router.post('/', middleware.verifyToken, controller.createListing)
router.get('/', controller.getAllListings)
router.get('/:id', controller.getListingById)
router.put('/:id', middleware.verifyToken, controller.updateListing)
router.delete('/:id', middleware.verifyToken, controller.deleteListing)

module.exports = router
