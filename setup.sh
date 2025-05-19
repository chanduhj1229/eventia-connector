
#!/bin/bash

echo "Setting up project structure..."

# Create necessary directories
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p frontend/public
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Backend setup
echo "Setting up backend..."
# Make sure package.json exists in backend folder
if [ ! -f backend/package.json ]; then
  cp backend/package.json backend/ 2>/dev/null || echo "Creating backend package.json..."
fi

# Copy backend files
cp backend/.env backend/ 2>/dev/null || echo "No .env file found, make sure to create one"
cp backend/server.js backend/ 2>/dev/null || echo "No server.js file found, make sure to create one"

# Create directories if they don't exist
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Copy files to directories
cp -r backend/routes/* backend/routes/ 2>/dev/null || echo "No routes files found"
cp -r backend/controllers/* backend/controllers/ 2>/dev/null || echo "No controller files found"
cp -r backend/models/* backend/models/ 2>/dev/null || echo "No model files found"
cp -r backend/middleware/* backend/middleware/ 2>/dev/null || echo "No middleware files found"

# Frontend setup
echo "Setting up frontend..."
# Create a package.json for frontend if it doesn't exist
if [ ! -f frontend/package.json ]; then
  echo "Creating package.json for frontend..."
  cat > frontend/package.json << EOF
{
  "name": "eventia-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.17",
    "lovable-tagger": "^0.1.2",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
EOF
fi

# Copy package-lock.json if it exists
if [ -f package-lock.json ]; then
  cp package-lock.json frontend/
fi

# Copy frontend files
echo "Copying frontend files..."
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p frontend/public

# Copy files with error handling
cp -r src/components/* frontend/src/components/ 2>/dev/null || echo "No component files found"
cp -r src/context/* frontend/src/context/ 2>/dev/null || echo "No context files found"
cp -r src/hooks/* frontend/src/hooks/ 2>/dev/null || echo "No hook files found"
cp -r src/lib/* frontend/src/lib/ 2>/dev/null || echo "No lib files found"
cp -r src/pages/* frontend/src/pages/ 2>/dev/null || echo "No page files found"
cp -r src/services/* frontend/src/services/ 2>/dev/null || echo "No service files found"

# Copy other frontend files if they exist
cp src/App.tsx frontend/src/ 2>/dev/null || echo "No App.tsx found"
cp src/App.css frontend/src/ 2>/dev/null || echo "No App.css found"
cp src/index.css frontend/src/ 2>/dev/null || echo "No index.css found"
cp src/main.tsx frontend/src/ 2>/dev/null || echo "No main.tsx found"
cp src/vite-env.d.ts frontend/src/ 2>/dev/null || echo "No vite-env.d.ts found"
cp vite.config.ts frontend/ 2>/dev/null || echo "No vite.config.ts found"
cp tailwind.config.ts frontend/ 2>/dev/null || echo "No tailwind.config.ts found"
cp postcss.config.js frontend/ 2>/dev/null || echo "No postcss.config.js found"

# Copy public assets
mkdir -p frontend/public
cp -r public/* frontend/public/ 2>/dev/null || echo "No public files found"

# Make the script executable
chmod +x setup.sh

echo "Setup complete. You can now run 'docker-compose up' to start the containers."
