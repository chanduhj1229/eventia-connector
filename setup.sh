
#!/bin/bash

# Create necessary directories
mkdir -p frontend/src
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Copy backend files
cp -r backend/.env backend/package.json backend/server.js backend/README.md backend/

# Copy frontend structure
cp -r src/* frontend/src/
cp vite.config.ts frontend/
cp package.json package-lock.json frontend/

# Done
echo "Project structure has been set up."
echo "You can now run 'docker-compose up' to start the containers."
