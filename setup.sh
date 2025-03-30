
#!/bin/bash

echo "Setting up project structure..."

# Create necessary directories
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p frontend/public
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Copy backend files
echo "Copying backend files..."
cp -r backend/.env backend/package.json backend/server.js backend/README.md backend/
cp -r backend/models/* backend/models/
cp -r backend/controllers/* backend/controllers/
cp -r backend/routes/* backend/routes/
cp -r backend/middleware/* backend/middleware/

# Copy frontend files
echo "Copying frontend files..."
cp -r src/components frontend/src/
cp -r src/context frontend/src/
cp -r src/hooks frontend/src/
cp -r src/lib frontend/src/
cp -r src/pages frontend/src/
cp -r src/services frontend/src/
cp src/App.tsx src/App.css src/index.css src/main.tsx src/vite-env.d.ts frontend/src/
cp vite.config.ts frontend/
cp tailwind.config.ts frontend/
cp postcss.config.js frontend/
cp package.json package-lock.json frontend/
cp -r public/* frontend/public/

# Make sure Dockerfiles are in the correct locations
echo "Setting up Docker files..."
cp frontend/Dockerfile frontend/
cp backend/Dockerfile backend/

echo "Setup complete. You can now run 'docker-compose up' to start the containers."
