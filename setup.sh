
#!/bin/bash

echo "Setting up project structure..."

# Create necessary directories
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p frontend/public
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Copy backend files
echo "Copying backend files..."
cp backend/.env backend/package.json backend/server.js backend/README.md backend/
mkdir -p backend/routes backend/controllers backend/models backend/middleware
cp -r backend/routes/* backend/routes/ 2>/dev/null || :
cp -r backend/controllers/* backend/controllers/ 2>/dev/null || :
cp -r backend/models/* backend/models/ 2>/dev/null || :
cp -r backend/middleware/* backend/middleware/ 2>/dev/null || :

# Create a simple package.json for frontend if it doesn't exist
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
cp -r src/components frontend/src/ 2>/dev/null || mkdir -p frontend/src/components
cp -r src/context frontend/src/ 2>/dev/null || mkdir -p frontend/src/context
cp -r src/hooks frontend/src/ 2>/dev/null || mkdir -p frontend/src/hooks
cp -r src/lib frontend/src/ 2>/dev/null || mkdir -p frontend/src/lib
cp -r src/pages frontend/src/ 2>/dev/null || mkdir -p frontend/src/pages
cp -r src/services frontend/src/ 2>/dev/null || mkdir -p frontend/src/services

# Copy other frontend files if they exist
cp src/App.tsx frontend/src/ 2>/dev/null || :
cp src/App.css frontend/src/ 2>/dev/null || :
cp src/index.css frontend/src/ 2>/dev/null || :
cp src/main.tsx frontend/src/ 2>/dev/null || :
cp src/vite-env.d.ts frontend/src/ 2>/dev/null || :
cp vite.config.ts frontend/ 2>/dev/null || :
cp tailwind.config.ts frontend/ 2>/dev/null || :
cp postcss.config.js frontend/ 2>/dev/null || :

# Copy public assets
cp -r public/* frontend/public/ 2>/dev/null || :

# Make sure Dockerfiles are in the correct locations
echo "Setting up Docker files..."
# No need to copy Dockerfiles as they are already in their respective directories

# Make the script executable
chmod +x setup.sh

echo "Setup complete. You can now run 'docker-compose up' to start the containers."
