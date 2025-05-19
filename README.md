
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

## Project Structure

```
eventia/
├── frontend/         # React frontend application
└── backend/          # Node.js Express backend with MongoDB
```

## Features
- Event creation and management for organizers
- Registration system with seat capacity management
- "House Full" indication when events reach capacity
- User authentication and authorization
