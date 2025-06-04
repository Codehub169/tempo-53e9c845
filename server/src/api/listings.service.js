const db = require('../database/setup');
const config = require('../config');

// --- WWS Calculation (Simplified Placeholder) ---
const _calculateWWSAndMaxRent = (listingData) => {
    let wwsPoints = 0;
    const size = parseFloat(listingData.size);
    const woz = parseFloat(listingData.woz);
    const outdoorSpaceSize = parseFloat(listingData.outdoorSpaceSize);
    const rooms = parseInt(listingData.rooms, 10);

    if (size && !isNaN(size)) {
        wwsPoints += Math.floor(size * 0.8);
    }
    const energyLabelPoints = {
        'A++++': 40, 'A+++': 35, 'A++': 30, 'A+': 25, 'A': 20,
        'B': 15, 'C': 10, 'D': 5, 'E': 0, 'F': -5, 'G': -10
    };
    if (listingData.energyLabel && energyLabelPoints[listingData.energyLabel] !== undefined) {
        wwsPoints += energyLabelPoints[listingData.energyLabel];
    }
    if (woz && !isNaN(woz)) {
        wwsPoints += Math.floor(woz / 20000);
    }
    
    const kitchenAmenitiesArray = Array.isArray(listingData.kitchenAmenities) ? listingData.kitchenAmenities : [];
    wwsPoints += Math.min(kitchenAmenitiesArray.length * 2, 15);

    const bathroomAmenitiesArray = Array.isArray(listingData.bathroomAmenities) ? listingData.bathroomAmenities : [];
    wwsPoints += Math.min(bathroomAmenitiesArray.length * 3, 15);
    
    if (outdoorSpaceSize && !isNaN(outdoorSpaceSize) && outdoorSpaceSize > 0) {
        wwsPoints += Math.floor(outdoorSpaceSize * 1.5);
    }
    if (rooms && !isNaN(rooms)) {
        wwsPoints += rooms * 2;
    }
    const maxLegalRent = parseFloat((wwsPoints * 5.56).toFixed(2));
    return {
        wwsPoints: Math.max(0, wwsPoints),
        maxLegalRent
    };
};

const listingsService = {
    create: async (listingData, files) => {
        return new Promise((resolve, reject) => {
            const photoPaths = files ? files.map(file => `${config.UPLOADS_ROUTE}/${file.filename}`) : [];
            const calculatedWWS = _calculateWWSAndMaxRent(listingData);

            const sql = `
                INSERT INTO listings (
                    title, address, description, apartmentType, size, rooms, bedrooms, 
                    energyLabel, woz, kitchenAmenities, bathroomAmenities, 
                    outdoorSpaceType, outdoorSpaceSize, photos, rentPrice, 
                    wwsPoints, maxLegalRent, contactName, contactEmail, contactPhone, status, userId
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const kitchenAmenities = JSON.stringify(Array.isArray(listingData.kitchenAmenities) ? listingData.kitchenAmenities : []);
            const bathroomAmenities = JSON.stringify(Array.isArray(listingData.bathroomAmenities) ? listingData.bathroomAmenities : []);

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
                calculatedWWS.wwsPoints,
                calculatedWWS.maxLegalRent,
                listingData.contactName,
                listingData.contactEmail,
                listingData.contactPhone,
                'pending',
                listingData.userId || null
            ];

            db.run(sql, params, function (err) {
                if (err) {
                    console.error('Error creating listing in service:', err.message);
                    return reject(err);
                }
                listingsService.findById(this.lastID)
                    .then(resolve)
                    .catch(reject);
            });
        });
    },

    findAll: (queryParams = {}) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM listings';
            const params = [];
            const conditions = [];

            if (queryParams.status) {
                conditions.push('status = ?');
                params.push(queryParams.status);
            } else {
                conditions.push("(status = 'pending' OR status = 'approved')");
            }

            if (queryParams.search) {
                conditions.push("(LOWER(title) LIKE LOWER(?) OR LOWER(address) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))");
                const searchTermLike = `%${queryParams.search}%`;
                params.push(searchTermLike, searchTermLike, searchTermLike);
            }
            if (queryParams.priceRange && queryParams.priceRange !== '') {
                const [minStr, maxStr] = queryParams.priceRange.split('-');
                const min = parseFloat(minStr);
                const max = maxStr ? parseFloat(maxStr) : Infinity;
                if (!isNaN(min)) {
                    conditions.push("rentPrice >= ?");
                    params.push(min);
                }
                if (!isNaN(max) && max !== Infinity) {
                    conditions.push("rentPrice <= ?");
                    params.push(max);
                }
            }
            if (queryParams.minArea && queryParams.minArea !== '') {
                const minArea = parseFloat(queryParams.minArea);
                if(!isNaN(minArea) && minArea > 0) {
                    conditions.push("size >= ?");
                    params.push(minArea);
                }
            }
            if (queryParams.rooms && queryParams.rooms !== '') {
                if (String(queryParams.rooms).endsWith('+')) {
                    const minRooms = parseInt(String(queryParams.rooms).slice(0, -1),10);
                    if(!isNaN(minRooms) && minRooms > 0) {
                        conditions.push("rooms >= ?");
                        params.push(minRooms);
                    }
                } else {
                    const numRooms = parseInt(queryParams.rooms,10);
                    if(!isNaN(numRooms) && numRooms > 0){
                        conditions.push("rooms = ?");
                        params.push(numRooms);
                    }
                }
            }
            if (queryParams.minWwsPoints && queryParams.minWwsPoints !== '') {
                const minWws = parseInt(queryParams.minWwsPoints,10);
                if(!isNaN(minWws) && minWws >= 0){
                    conditions.push("wwsPoints >= ?");
                    params.push(minWws);
                }
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            let orderBy = 'ORDER BY createdAt DESC';
            if (queryParams.sort) {
                const sortFieldMap = {
                    'price-asc': 'rentPrice ASC, createdAt DESC',
                    'price-desc': 'rentPrice DESC, createdAt DESC',
                    'wws-asc': 'wwsPoints ASC, createdAt DESC',
                    'wws-desc': 'wwsPoints DESC, createdAt DESC',
                    'newest': 'createdAt DESC'
                };
                if (sortFieldMap[queryParams.sort]) {
                    orderBy = `ORDER BY ${sortFieldMap[queryParams.sort]}`;
                } else {
                    // Potentially log invalid sort param or default
                    console.warn(`Invalid sort parameter: ${queryParams.sort}. Defaulting to newest.`);
                }
            }
            sql += ` ${orderBy}`;
            
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Error finding listings in service:', err.message);
                    return reject(err);
                }
                const listings = rows.map(row => ({
                    ...row,
                    kitchenAmenities: JSON.parse(row.kitchenAmenities || '[]'),
                    bathroomAmenities: JSON.parse(row.bathroomAmenities || '[]'),
                    photos: JSON.parse(row.photos || '[]')
                }));
                resolve(listings);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM listings WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error finding listing by ID in service:', err.message);
                    return reject(err);
                }
                if (row) {
                    const listing = {
                        ...row,
                        kitchenAmenities: JSON.parse(row.kitchenAmenities || '[]'),
                        bathroomAmenities: JSON.parse(row.bathroomAmenities || '[]'),
                        photos: JSON.parse(row.photos || '[]')
                    };
                    resolve(listing); 
                } else {
                    resolve(null);
                }
            });
        });
    },
    
    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            const validStatuses = ['pending', 'approved', 'rejected', 'rented']; // Example statuses
            if (!validStatuses.includes(status)){
                const err = new Error('Invalid status value provided.');
                err.status = 400; // Bad request
                return reject(err);
            }
            const sql = 'UPDATE listings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [status, id], function(err) {
                if (err) {
                    console.error(`Error updating status for listing ${id}:`, err.message);
                    return reject(err);
                }
                if (this.changes === 0) {
                    // This means no row was updated, likely because the ID doesn't exist.
                    const notFoundErr = new Error(`Listing with ID ${id} not found.`);
                    notFoundErr.status = 404;
                    return reject(notFoundErr);
                }
                listingsService.findById(id).then(resolve).catch(reject);
            });
        });
    }
};

module.exports = listingsService;
