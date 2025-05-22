
import Event from '../models/eventModel.js';
import Log from '../models/logModel.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { category, location, date, organizerId } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (date) {
      const searchDate = new Date(date);
      query.date = { $gte: searchDate };
    }
    
    // Filter by organizer if requested (for dashboard)
    if (organizerId) {
      query.organizer = organizerId;
    }
    
    // If user is an organizer and making a request (not a public browse), only show their events
    if (req.user && req.user.role === 'organizer') {
      // Only restrict if it's not the public browse endpoint (which doesn't have auth)
      // Check if the request comes through the auth middleware
      if (req.originalUrl.includes('dashboard') || req.headers.authorization) {
        query.organizer = req.user._id;
      }
    }
    
    const events = await Event.find(query).populate('organizer', 'name email');
    
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email profileImage')
      .populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // If user is organizer, check if they're the event organizer
    if (req.user && req.user.role === 'organizer' && 
        event.organizer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only view details of events you organize'
      });
    }
    
    // Calculate available seats
    const availableSeats = event.capacity - event.attendees.length;
    
    res.status(200).json({
      status: 'success',
      data: { 
        event,
        availableSeats,
        isHouseFull: availableSeats <= 0
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const newEvent = {
      ...req.body,
      organizer: req.user._id
    };
    
    const event = await Event.create(newEvent);
    
    // Create log entry for event creation
    await Log.create({
      eventId: event._id,
      userId: req.user._id,
      organizerId: req.user._id,
      action: 'event_created',
    });
    
    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // Check if user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this event'
      });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name email');
    
    res.status(200).json({
      status: 'success',
      data: { event: updatedEvent }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // Check if user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to delete this event'
      });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // Prevent organizers from registering for events
    if (req.user.role === 'organizer') {
      return res.status(403).json({
        status: 'fail',
        message: 'Organizers cannot register for events'
      });
    }
    
    // Check if user is already registered
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already registered for this event'
      });
    }
    
    // Check if event is at capacity
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({
        status: 'fail',
        message: 'This event is now full and not accepting new registrations',
        isHouseFull: true
      });
    }
    
    // Add user to event attendees
    event.attendees.push(req.user._id);
    await event.save();
    
    // Create log entry for user registration
    await Log.create({
      eventId: event._id,
      userId: req.user._id,
      organizerId: event.organizer,
      action: 'user_registered',
    });
    
    // Calculate available seats after registration
    const availableSeats = event.capacity - event.attendees.length;
    
    res.status(200).json({
      status: 'success',
      message: 'Successfully registered for the event',
      data: { 
        event,
        availableSeats,
        isHouseFull: availableSeats <= 0
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get event capacity status
export const getEventCapacityStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // Calculate available seats
    const availableSeats = event.capacity - event.attendees.length;
    const isHouseFull = availableSeats <= 0;
    
    res.status(200).json({
      status: 'success',
      data: {
        capacity: event.capacity,
        attendeesCount: event.attendees.length,
        availableSeats,
        isHouseFull
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get event logs
export const getEventLogs = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    // Check if user is authorized (organizer or admin)
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to view these logs'
      });
    }
    
    // Get all logs for this event
    const logs = await Log.find({ eventId })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      status: 'success',
      data: { logs }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
