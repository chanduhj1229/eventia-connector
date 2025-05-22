
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Log from '../models/logModel.js';

// Generate JWT token with improved security
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in the environment variables');
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password'
      });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    if (user) {
      // Generate token after successful user creation
      const token = generateToken(user._id);
      
      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }
    
    // Find user by email (explicitly include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Compare passwords
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    user.password = undefined;
    
    // If everything is ok, send token to client
    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('events')
      .populate('registeredEvents');
    
    if (user) {
      res.status(200).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          events: user.events,
          registeredEvents: user.registeredEvents
        }
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profileImage = req.body.profileImage || user.profileImage;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        status: 'success',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          token: generateToken(updatedUser._id)
        }
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user logs (events created and registrations)
export const getUserLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // For organizers: find events they've created
    const createdEventLogs = req.user.role === 'organizer' || req.user.role === 'admin' 
      ? await Log.find({ 
          organizerId: userId,
          action: 'event_created' 
        })
        .populate('eventId', 'title date location')
        .sort({ timestamp: -1 })
      : [];
    
    // For all users: find events they've registered for
    const registrationLogs = await Log.find({ 
        userId: userId,
        action: 'user_registered'
      })
      .populate('eventId', 'title date location')
      .populate('organizerId', 'name')
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      status: 'success',
      data: {
        createdEvents: createdEventLogs,
        registrations: registrationLogs
      }
    });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
