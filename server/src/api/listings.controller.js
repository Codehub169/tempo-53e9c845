// const listingsService = require('./listings.service'); // Will be implemented later
const config = require('../config');
const db = require('../database/setup'); // Using direct db access for now

// Mock service for now, to be replaced with actual service calls
const listingsService = {
  findAll: async (queryParams) => {
    return new Promise((resolve, reject) => {
      // Basic filtering example (can be expanded)
      let sql = "SELECT * FROM listings WHERE status = 'approved'";
      const params = [];
      // Add more filtering based on queryParams here if needed

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON fields
          const listings = rows.map(row => ({
            ...row,
            kitchenAmenities: row.kitchenAmenities ? JSON.parse(row.kitchenAmenities) : [],
            bathroomAmenities: row.bathroomAmenities ? JSON.parse(row.bathroomAmenities) : [],
            photos: row.photos ? JSON.parse(row.photos) : []
          })); 
          resolve(listings);
        }
      });
    });
  },
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM listings WHERE id = ?";
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(({
              ...row,
              kitchenAmenities: row.kitchenAmenities ? JSON.parse(row.kitchenAmenities) : [],
              bathroomAmenities: row.bathroomAmenities ? JSON.parse(row.bathroomAmenities) : [],
              photos: row.photos ? JSON.parse(row.photos) : []
            }));
          } else {
            resolve(null); // Not found
          }
        }
      });
    });
  },
  create: async (listingData) => {
    return new Promise((resolve, reject) => {
      const {
        title, address, description, apartmentType, size, rooms, bedrooms, 
        energyLabel, woz, kitchenAmenities, bathroomAmenities, outdoorSpaceType, 
        outdoorSpaceSize, photos, rentPrice, contactName, contactEmail, contactPhone,
        // wwsPoints, maxLegalRent will be calculated later or by a separate process
        userId // Assuming userId might come from auth middleware later
      } = listingData;

      const sql = `INSERT INTO listings (
        title, address, description, apartmentType, size, rooms, bedrooms, 
        energyLabel, woz, kitchenAmenities, bathroomAmenities, outdoorSpaceType, 
        outdoorSpaceSize, photos, rentPrice, contactName, contactEmail, contactPhone,
        status, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      
      const params = [
        title, address, description, apartmentType, size, rooms, bedrooms,
        energyLabel, woz, JSON.stringify(kitchenAmenities || []), JSON.stringify(bathroomAmenities || []),
        outdoorSpaceType, outdoorSpaceSize, JSON.stringify(photos || []),
        rentPrice, contactName, contactEmail, contactPhone,
        'pending', // Default status
        userId || null
      ];

      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...listingData });
        }
      });
    });
  }
};

exports.createListing = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const listingData = req.body;
    
    // Process photos from multer
    if (req.files && req.files.length > 0) {
      listingData.photos = req.files.map(file => `${config.UPLOADS_ROUTE}/${file.filename}`);
    } else {
      listingData.photos = [];
    }

    // Convert checkbox values (amenities) which might come as single values if only one is checked
    // Assuming frontend sends them as arrays already or multer handles this field type well for text fields.
    // For now, we assume kitchenAmenities and bathroomAmenities are already in correct array format from client or parsed by body-parser.
    // If they are not arrays, they should be converted here before JSON.stringify in the service.

    const newListing = await listingsService.create(listingData);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    // Basic error handling. In a real app, distinguish error types.
    if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'A listing with similar unique details already exists.' });
    }
    res.status(500).json({ message: 'Failed to create listing.', error: error.message });
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const listings = await listingsService.findAll(req.query);
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings.', error: error.message });
  }
};

exports.getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingsService.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error(`Error fetching listing ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch listing.', error: error.message });
  }
};
