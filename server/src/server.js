require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config'); // Import config for UPLOADS_ROUTE and UPLOADS_DIR

const listingsRouter = require('./api/listings.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:9000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
// config.UPLOADS_DIR is expected to be a path like 'server/uploads' relative to project root.
// express.static resolves this relative to CWD, which is usually the project root.
app.use(config.UPLOADS_ROUTE, express.static(config.UPLOADS_DIR));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to WWS Apartment Finder API!' });
});

app.use('/api/listings', listingsRouter);

// Serve React Frontend (static files)
const clientBuildPath = path.join(__dirname, '../../client/build');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
  console.log(`Serving static files from ${clientBuildPath}`);
} else {
  console.log(`Client build directory not found at ${clientBuildPath}. API will run, but frontend needs to be served separately if not in production build.`);
}

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = (process.env.NODE_ENV === 'production' && statusCode === 500) 
    ? 'An internal server error occurred.' 
    : err.message || 'An internal server error occurred.';
  res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.CLIENT_URL) {
    console.log(`CORS enabled for: ${process.env.CLIENT_URL}`);
  }
  // Log the resolved path for UPLOADS_DIR for clarity
  const resolvedUploadsDir = path.resolve(config.UPLOADS_DIR);
  console.log(`Uploads will be served from ${config.UPLOADS_ROUTE} and stored in ${resolvedUploadsDir} (resolved from '${config.UPLOADS_DIR}')`);
});
