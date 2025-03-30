
# Eventia - Event Management Platform

A full-stack application for managing events with separate frontend and backend services.

## Project Structure

This project is organized into two main folders:
- `frontend/` - React client application
- `backend/` - Express API server

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your machine

### Running the Application
1. Clone this repository
2. Open a terminal in the project root directory
3. Run the following command:

```bash
docker-compose up
```

This will:
- Build and start the frontend container (accessible at http://localhost:8080)
- Build and start the backend container (accessible at http://localhost:5000)
- Start a MongoDB container for the database

## Development Without Docker

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend
The frontend uses the following environment variables:
- `VITE_API_URL` - URL of the backend API (default: http://localhost:5000/api)

### Backend
The backend uses the following environment variables:
- `PORT` - Port for the server (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation/validation
