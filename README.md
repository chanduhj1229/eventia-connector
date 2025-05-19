
# Eventia - Event Management Platform

A streamlined event management platform with a clean two-folder structure:
- `frontend/` - React client application
- `backend/` - Express API server with MongoDB

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your machine

### Running the Application
1. Clone this repository
2. Run the setup script to organize files into frontend and backend folders:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Start the application with Docker Compose:
   ```bash
   docker-compose up
   ```

This will:
- Build and start the frontend container (accessible at http://localhost:8080)
- Build and start the backend container (accessible at http://localhost:5000)
- Start a MongoDB container for the database

## Running Locally Without Docker

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at http://localhost:8080

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventia
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Make sure you have MongoDB installed and running locally.
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be accessible at http://localhost:5000

## Features
- Event creation and management for organizers
- Registration system with seat capacity management
- "House Full" indication when events reach capacity
- User authentication and authorization
