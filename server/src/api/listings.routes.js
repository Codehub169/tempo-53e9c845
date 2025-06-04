const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const listingsController = require('./listings.controller');
const config = require('../config');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = config.UPLOADS_DIR;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    req.fileValidationError = 'Only image files (jpg, jpeg, png, gif, webp) are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter
});

// --- Listings Routes ---

// GET /api/listings - Get all listings (with optional query params for filtering)
router.get('/', listingsController.getListings);

// GET /api/listings/:id - Get a single listing by ID
router.get('/:id', listingsController.getListingById);

// POST /api/listings - Create a new listing
// 'photos' is the field name from the frontend form, max 10 files
router.post('/', upload.array('photos', 10), listingsController.createListing);

// PUT /api/listings/:id - Update an existing listing (placeholder)
// router.put('/:id', listingsController.updateListing);

// DELETE /api/listings/:id - Delete a listing (placeholder)
// router.delete('/:id', listingsController.deleteListing);

module.exports = router;
