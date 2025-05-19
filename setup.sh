
#!/bin/bash

echo "Setting up project with frontend and backend folders..."

# Create necessary directories
mkdir -p frontend/src/components frontend/src/context frontend/src/hooks frontend/src/lib frontend/src/pages frontend/src/services
mkdir -p frontend/public
mkdir -p backend/routes backend/controllers backend/models backend/middleware

# Backend setup
echo "Setting up backend..."
# Copy backend files and package.json
[ -f backend/package.json ] || cp backend/package.json backend/ 2>/dev/null || cp package.json backend/ 2>/dev/null || echo "Creating backend package.json..."
cp backend/.env backend/ 2>/dev/null || echo "Creating .env file in backend..."

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
  echo "PORT=5000" > backend/.env
  echo "MONGO_URI=mongodb://mongo:27017/eventia" >> backend/.env
  echo "JWT_SECRET=your_jwt_secret_key_here" >> backend/.env
fi

# Copy backend files from src directory if they exist
cp backend/server.js backend/ 2>/dev/null || cp src/server.js backend/ 2>/dev/null || echo "No server.js found"

# Copy directory contents if they exist
cp -r backend/routes/* backend/routes/ 2>/dev/null || cp -r src/routes/* backend/routes/ 2>/dev/null || echo "No routes files found"
cp -r backend/controllers/* backend/controllers/ 2>/dev/null || cp -r src/controllers/* backend/controllers/ 2>/dev/null || echo "No controller files found"
cp -r backend/models/* backend/models/ 2>/dev/null || cp -r src/models/* backend/models/ 2>/dev/null || echo "No model files found"
cp -r backend/middleware/* backend/middleware/ 2>/dev/null || cp -r src/middleware/* backend/middleware/ 2>/dev/null || echo "No middleware files found"

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
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "lucide-react": "^0.462.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
EOF
fi

# Copy frontend files from src directory if they exist
mkdir -p frontend/src
cp -r src/* frontend/src/ 2>/dev/null || echo "No source files found in src/"

# Copy configuration files if they exist
cp vite.config.ts frontend/ 2>/dev/null || echo "No vite.config.ts found"
cp tailwind.config.ts frontend/ 2>/dev/null || echo "No tailwind.config.ts found"
cp postcss.config.js frontend/ 2>/dev/null || echo "No postcss.config.js found"
cp tsconfig.json frontend/ 2>/dev/null || echo "No tsconfig.json found"

# Copy public assets if they exist
mkdir -p frontend/public
cp -r public/* frontend/public/ 2>/dev/null || echo "No public files found"

echo "Setup complete. Project structure now has only frontend and backend folders."
echo "You can now run 'docker-compose up' to start the containers."
