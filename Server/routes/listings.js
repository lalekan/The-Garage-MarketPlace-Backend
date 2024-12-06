const express = require('express')
const multer = require('multer')
const path = require('path')
const { authMiddleware } = require('../middleware/auth')
const Listing = require('../models/listing')

const router = express.Router()

// Set storage options for multer (storing images in an 'uploads' folder)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Save images in 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to filename
    }
  });
  
  // Filter files (you can change the logic based on your requirements)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true); // Allow image files
    } else {
      cb(new Error('Invalid file type, only images are allowed'), false);
    }
  };
  
  // Initialize multer with storage and file filter settings
  const upload = multer({ storage: storage, fileFilter: fileFilter });

// Protected route to create a new listing with image upload
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`); 
  
      const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: imageUrls,  // Save image URLs
        author: req.user._id,
      });
  
      await newListing.save();
      res.status(201).json({ message: 'Listing created successfully', newListing });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

// Error-handling middleware
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(500).json({ message: 'Unexpected error occurred' });
    }
    next();
})
  

module.exports = router
