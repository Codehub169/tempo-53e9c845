const listingsService = require('./listings.service');

exports.createListing = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      // Set status on error object for centralized handler, or handle directly
      const err = new Error(req.fileValidationError);
      err.status = 400;
      return next(err);
    }

    const listingData = req.body; // Non-file fields from FormData
    const files = req.files;      // File objects from Multer

    const newListing = await listingsService.create(listingData, files);
    res.status(201).json(newListing);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
        error.status = 409; // Specific error for unique constraint
        error.message = 'A listing with similar unique details already exists.';
    }
    next(error); // Pass to centralized error handler
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const listings = await listingsService.findAll(req.query);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

exports.getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        const err = new Error('Invalid listing ID format. ID must be an integer.');
        err.status = 400;
        return next(err);
    }
    const listing = await listingsService.findById(numericId);
    if (!listing) {
      const err = new Error('Listing not found.');
      err.status = 404;
      return next(err);
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
