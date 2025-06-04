const db = require('../../database/setup');
const {
    UPLOADS_ROUTE
} = require('../../config');

// --- WWS Calculation (Simplified Placeholder) ---
// This is a highly simplified placeholder for WWS calculation.
// A real implementation would require detailed rules from the Woningwaarderingsstelsel.
const _calculateWWSAndMaxRent = (listingData) => {
    let wwsPoints = 0;

    // 1. Size (Oppervlakte)
    if (listingData.size) {
        wwsPoints += Math.floor(listingData.size * 0.8); // Example: 0.8 points per m²
    }

    // 2. Energy Label (Energieprestatie)
    const energyLabelPoints = {
        'A++++': 40, 'A+++': 35, 'A++': 30, 'A+': 25, 'A': 20,
        'B': 15, 'C': 10, 'D': 5, 'E': 0, 'F': -5, 'G': -10
    };
    if (listingData.energyLabel && energyLabelPoints[listingData.energyLabel] !== undefined) {
        wwsPoints += energyLabelPoints[listingData.energyLabel];
    }

    // 3. WOZ-waarde
    if (listingData.woz) {
        // Example: points based on a percentage of WOZ, capped or scaled.
        // This is highly dependent on specific WWS rules for WOZ contribution.
        wwsPoints += Math.floor(listingData.woz / 20000); // Highly simplified example
    }

    // 4. Kitchen Amenities (Keukenvoorzieningen)
    if (listingData.kitchenAmenities && Array.isArray(listingData.kitchenAmenities)) {
        // Example: 2 points per selected amenity, up to a max for 'luxurious'
        wwsPoints += Math.min(listingData.kitchenAmenities.length * 2, 15); 
    }

    // 5. Bathroom Amenities (Sanitaire voorzieningen)
    if (listingData.bathroomAmenities && Array.isArray(listingData.bathroomAmenities)) {
        // Example: 3 points per selected amenity, up to a max for 'luxurious'
        wwsPoints += Math.min(listingData.bathroomAmenities.length * 3, 15);
    }

    // 6. Outdoor Space (Buitenruimte)
    if (listingData.outdoorSpaceSize && parseFloat(listingData.outdoorSpaceSize) > 0) {
        wwsPoints += Math.floor(parseFloat(listingData.outdoorSpaceSize) * 1.5); // Example: 1.5 points per m²
    }
    
    // 7. Number of heated rooms (not explicitly in form, but part of WWS)
    // Assuming 'rooms' includes heated rooms for this placeholder
    if (listingData.rooms) {
        wwsPoints += parseInt(listingData.rooms, 10) * 2; // Example: 2 points per room
    }

    // Calculate Max Legal Rent (Huurprijs)
    // Example: €5.56 per point (derived from example 152pnt = €845.60)
    const maxLegalRent = parseFloat((wwsPoints * 5.56).toFixed(2));

    return {
        wwsPoints: Math.max(0, wwsPoints), // Ensure points are not negative
        maxLegalRent
    };
};

const listingsService = {
    create: async (listingData, files) => {
        return new Promise((resolve, reject) => {
            const photoPaths = files ? files.map(file => `${UPLOADS_ROUTE}/${file.filename}`) : [];
            
            const { wwsPoints, maxLegalRent } = _calculateWWSAndMaxRent(listingData);

            const sql = `
                INSERT INTO listings (
                    title, address, description, apartmentType, size, rooms, bedrooms, 
                    energyLabel, woz, kitchenAmenities, bathroomAmenities, 
                    outdoorSpaceType, outdoorSpaceSize, photos, rentPrice, 
                    wwsPoints, maxLegalRent, contactName, contactEmail, contactPhone, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Ensure amenities are stringified if they are arrays. The controller should ideally send them as arrays.
            const kitchenAmenities = typeof listingData.kitchenAmenities === 'string' ? listingData.kitchenAmenities : JSON.stringify(listingData.kitchenAmenities || []);
            const bathroomAmenities = typeof listingData.bathroomAmenities === 'string' ? listingData.bathroomAmenities : JSON.stringify(listingData.bathroomAmenities || []);

            const params = [
                listingData.title,
                listingData.address,
                listingData.description,
                listingData.apartmentType,
                parseFloat(listingData.size) || 0,
                parseInt(listingData.rooms, 10) || 0,
                parseInt(listingData.bedrooms, 10) || 0,
                listingData.energyLabel,
                parseFloat(listingData.woz) || 0,
                kitchenAmenities,
                bathroomAmenities,
                listingData.outdoorSpaceType,
                parseFloat(listingData.outdoorSpaceSize) || 0,
                JSON.stringify(photoPaths),
                parseFloat(listingData.rentPrice) || 0,
                wwsPoints,
                maxLegalRent,
                listingData.contactName,
                listingData.contactEmail,
                listingData.contactPhone,
                'pending' // Default status
            ];

            db.run(sql, params, function (err) {
                if (err) {
                    console.error('Error creating listing in service:', err.message);
                    reject(err);
                } else {
                    // Fetch the newly created listing to return it
                    listingsService.findById(this.lastID)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    },

    findAll: (filters = {}) => {
        return new Promise((resolve, reject) => {
            // Basic filtering for status, extendable for other filters
            // For now, fetching 'approved' listings as hinted by controller summary. If none, adjust as needed.
            // If 'approved' status isn't used yet, this might return empty. Consider 'pending' or removing status filter for dev.
            let sql = 'SELECT * FROM listings WHERE status = ?';
            const queryParams = ['approved']; 

            // Example: Add more filters (e.g., city, price range)
            // if (filters.city) { sql += ' AND city = ?'; queryParams.push(filters.city); }
            // ... add other filters

            sql += ' ORDER BY createdAt DESC';

            db.all(sql, queryParams, (err, rows) => {
                if (err) {
                    console.error('Error finding listings in service:', err.message);
                    reject(err);
                } else {
                    const listings = rows.map(row => ({
                        ...row,
                        kitchenAmenities: JSON.parse(row.kitchenAmenities || '[]'),
                        bathroomAmenities: JSON.parse(row.bathroomAmenities || '[]'),
                        photos: JSON.parse(row.photos || '[]')
                    }));
                    resolve(listings);
                }
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM listings WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error finding listing by ID in service:', err.message);
                    reject(err);
                } else if (row) {
                    const listing = {
                        ...row,
                        kitchenAmenities: JSON.parse(row.kitchenAmenities || '[]'),
                        bathroomAmenities: JSON.parse(row.bathroomAmenities || '[]'),
                        photos: JSON.parse(row.photos || '[]')
                    };
                    resolve(listing);
                } else {
                    resolve(null); // Not found
                }
            });
        });
    },
    
    // Placeholder for updating a listing (e.g., status from pending to approved)
    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE listings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [status, id], function(err) {
                if (err) {
                    console.error(`Error updating status for listing ${id}:`, err.message);
                    return reject(err);
                }
                if (this.changes === 0) {
                    return resolve(null); // Not found or no change needed
                }
                listingsService.findById(id).then(resolve).catch(reject); // Return updated listing
            });
        });
    }
};

module.exports = listingsService;
