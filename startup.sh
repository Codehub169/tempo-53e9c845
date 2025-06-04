#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Print commands and their arguments as they are executed.
# set -x

echo "--- WWS Apartment Finder Startup Script ---"

# --- Configuration ---
APP_PORT=9000 # Port for the main application server (NodeJS serving client build)
CLIENT_DIR="client"
SERVER_DIR="server"

# --- Helper Functions ---
echo_step() {
    echo "
==> $1
"
}

echo_sub_step() {
    echo "  -> $1"
}

# --- Environment Checks ---
echo_step "Checking prerequisites..."

# Check for Node.js and npm
if ! command -v node &> /dev/null
then
    echo_sub_step "Node.js could not be found. Please install Node.js (v16+ recommended)."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo_sub_step "npm could not be found. Please install npm."
    exit 1
fi

echo_sub_step "Node.js version: $(node --version)"
echo_sub_step "npm version: $(npm --version)"

# --- Install Root Dependencies ---
echo_step "Installing root project dependencies (if package.json exists)..."
if [ -f "package.json" ]; then
    npm install
else
    echo_sub_step "Root package.json not found. Skipping root dependency installation."
fi

# --- Install Server Dependencies ---
echo_step "Installing server dependencies..."
if [ -d "$SERVER_DIR" ] && [ -f "$SERVER_DIR/package.json" ]; then
    (cd "$SERVER_DIR" && npm install)
else
    echo_sub_step "Server directory or package.json not found. Skipping server dependency installation."
fi

# --- Install Client Dependencies ---
echo_step "Installing client dependencies..."
if [ -d "$CLIENT_DIR" ] && [ -f "$CLIENT_DIR/package.json" ]; then
    (cd "$CLIENT_DIR" && npm install)
else
    echo_sub_step "Client directory or package.json not found. Skipping client dependency installation."
fi

# --- Setup Server Environment ---
echo_step "Setting up server environment..."
if [ -d "$SERVER_DIR" ]; then
    if [ ! -f "$SERVER_DIR/.env" ] && [ -f "$SERVER_DIR/.env.example" ]; then
        echo_sub_step "No .env file found in server directory. Copying .env.example to .env..."
        cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
        echo_sub_step "IMPORTANT: Please review and update $SERVER_DIR/.env with your actual configuration."
    elif [ -f "$SERVER_DIR/.env" ]; then
        echo_sub_step ".env file already exists in server directory."
    else
        echo_sub_step "No .env.example found in server directory to copy."
    fi
else
    echo_sub_step "Server directory not found. Skipping server environment setup."
fi

# --- Build Client ---
echo_step "Building client application..."
if [ -d "$CLIENT_DIR" ] && [ -f "$CLIENT_DIR/package.json" ]; then
    (cd "$CLIENT_DIR" && npm run build)
    echo_sub_step "Client build complete. Static files are in $CLIENT_DIR/build"
else
    echo_sub_step "Client directory or package.json not found. Skipping client build."
    echo_sub_step "Ensure client is built manually if server expects static assets."
fi

# --- Run Database Setup (if applicable) ---
echo_step "Setting up database..."
if [ -d "$SERVER_DIR" ] && [ -f "$SERVER_DIR/src/database/setup.js" ]; then
    echo_sub_step "Running database setup script..."
    (cd "$SERVER_DIR" && node src/database/setup.js)
    echo_sub_step "Database setup complete."
else
    echo_sub_step "Database setup script not found ($SERVER_DIR/src/database/setup.js). Skipping."
fi

# --- Start Application ---
echo_step "Starting WWS Apartment Finder application..."

# The server will be configured to serve the client's build files
# and listen on the APP_PORT.
if [ -d "$SERVER_DIR" ] && [ -f "$SERVER_DIR/src/server.js" ]; then
    echo_sub_step "Starting NodeJS server..."
    echo_sub_step "Application will be available at http://localhost:$APP_PORT"
    
    # Pass APP_PORT to the server environment
    # The server.js should be adapted to use process.env.PORT and serve client build files
    (cd "$SERVER_DIR" && PORT=$APP_PORT npm start)
else
    echo_sub_step "Server entry point ($SERVER_DIR/src/server.js) not found. Cannot start application."
    exit 1
fi

echo "
--- WWS Apartment Finder is running! ---
"

# Keep script running if needed (e.g. if server starts in background)
# wait
