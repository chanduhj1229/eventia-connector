
#!/bin/bash

# Create necessary directories
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Copy backend files
cp backend/.env backend/Dockerfile backend/package.json backend/server.js backend/README.md backend/

# Copy frontend files
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

# Copy public assets
mkdir -p frontend/public
cp -r public/* frontend/public/

# Make the script executable
chmod +x setup.sh

# Done
echo "Project structure has been set up."
echo "You can now run 'docker-compose up' to start the containers."
