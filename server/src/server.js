require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes (example - to be created later)
// const listingsRouter = require('./api/listings.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:9000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API Routes (placeholder - to be implemented in subsequent files)
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to WWS Apartment Finder API!' });
});

// app.use('/api/listings', listingsRouter); // Uncomment when listings.routes.js is created

// Serve React Frontend (static files)
const clientBuildPath = path.join(__dirname, '../../client/build');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  
  // For any GET request that doesn't match an API route or a static file, 
  // serve the React app's index.html file.
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
  console.log(`Serving static files from ${clientBuildPath}`);
} else {
  console.log(`Client build directory not found at ${clientBuildPath}. API will run, but frontend needs to be served separately if not in production build.`);
}

// Basic Error Handling Middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.CLIENT_URL) {
    console.log(`CORS enabled for: ${process.env.CLIENT_URL}`);
  }
});
