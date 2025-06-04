const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure the database directory exists
const dbDir = path.dirname(config.DATABASE_URL);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

const db = new sqlite3.Database(config.DATABASE_URL, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log(`Connected to SQLite database: ${config.DATABASE_URL}`);
  createTables();
});

function createTables() {
  const createListingsTableSQL = `
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      description TEXT NOT NULL,
      apartmentType TEXT NOT NULL, 
      size INTEGER NOT NULL,            -- in m2
      rooms INTEGER NOT NULL,           -- total number of rooms
      bedrooms INTEGER NOT NULL,
      energyLabel TEXT, 
      woz INTEGER,                      -- WOZ-waarde in EUR
      kitchenAmenities TEXT,            -- JSON string array of amenities
      bathroomAmenities TEXT,           -- JSON string array of amenities
      outdoorSpaceType TEXT,            -- e.g., 'balcony', 'garden', 'none'
      outdoorSpaceSize INTEGER,         -- in m2, if outdoorSpaceType is not 'none'
      photos TEXT,                      -- JSON string array of image URLs/paths
      rentPrice INTEGER NOT NULL,         -- Asking rent price in EUR per month
      
      wwsPoints INTEGER,                -- Calculated WWS points (can be null initially)
      maxLegalRent INTEGER,             -- Calculated max legal rent (can be null initially)
      
      contactName TEXT NOT NULL,
      contactEmail TEXT NOT NULL,
      contactPhone TEXT,                -- Optional
      
      status TEXT DEFAULT 'pending',    -- e.g., 'pending', 'approved', 'rejected'
      userId INTEGER,                   -- Optional: if users can log in and list
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.serialize(() => {
    db.run(createListingsTableSQL, (err) => {
      if (err) {
        console.error('Error creating listings table:', err.message);
      } else {
        console.log('Listings table created or already exists.');
      }
    });

    // Trigger for updatedAt
    const createUpdatedAtTriggerSQL = `
      CREATE TRIGGER IF NOT EXISTS update_listings_updatedAt
      AFTER UPDATE ON listings
      FOR EACH ROW
      BEGIN
        UPDATE listings SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `;
    db.run(createUpdatedAtTriggerSQL, (err) => {
      if (err) {
        console.error('Error creating updatedAt trigger for listings:', err.message);
      } else {
        console.log('UpdatedAt trigger for listings created or already exists.');
      }
    });
  });
}

// This allows running the script directly via `node src/database/setup.js` or `npm run db:setup`
if (require.main === module) {
  // The script is being run directly. We already connect and call createTables above.
  // db.close() should be handled carefully if script exits immediately.
  // For now, let it run and then manually close or let the process exit.
  console.log('Database setup script executed.');
}

module.exports = db; // Export db instance for potential use in services, though services might create their own connections.
