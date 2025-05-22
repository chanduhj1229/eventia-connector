
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS for our frontend
app.use(cors({
  origin: '*', // In production, you should specify the exact origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Eventia API is running');
});

// API route
app.get('/api', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Eventia API is running',
    endpoints: {
      events: '/api/events',
      users: '/api/users'
    }
  });
});

// MongoDB connection with improved error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure code on connection error
  });

// Handle MongoDB connection events
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB error:', error));
db.once('open', () => console.log('MongoDB connection established'));
