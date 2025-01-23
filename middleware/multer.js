const multer = require('multer')
const path = require('path')

// Define storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) 
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/
  const mimeType = allowedFileTypes.test(file.mimetype)
  const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())

  if (mimeType && extName) {
    return cb(null, true) // Accept the file
  }
  cb(new Error('Only image files are allowed!'), false) // Reject non-image files
}

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
})

module.exports = upload
