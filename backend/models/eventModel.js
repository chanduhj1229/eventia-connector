
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Event category is required']
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
