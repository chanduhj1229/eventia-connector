
# Eventia Backend

This is the backend API for the Eventia event management platform.

## Setup & Installation

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventia
JWT_SECRET=your_jwt_secret_key_here
```

3. Start the development server:
```
npm run dev
```

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PATCH /api/users/profile` - Update user profile (Protected)

### Event Routes
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event (Protected, Organizer only)
- `GET /api/events/:id` - Get event by ID
- `PATCH /api/events/:id` - Update event (Protected, Organizer only)
- `DELETE /api/events/:id` - Delete event (Protected, Organizer only)
- `POST /api/events/:id/register` - Register for an event (Protected)

## Authentication

This API uses JWT for authentication. Protected routes require a valid token to be included in the Authorization header:

```
Authorization: Bearer <token>
```
