
import Event from '../models/eventModel.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { category, location, date } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (date) {
      const searchDate = new Date(date);
      query.date = { $gte: searchDate };
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
