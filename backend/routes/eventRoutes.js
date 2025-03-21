
import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  registerForEvent
} from '../controllers/eventController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllEvents)
  .post(protect, restrictTo('organizer', 'admin'), createEvent);

router.route('/:id')
  .get(getEventById)
  .patch(protect, restrictTo('organizer', 'admin'), updateEvent)
  .delete(protect, restrictTo('organizer', 'admin'), deleteEvent);

router.post('/:id/register', protect, registerForEvent);

export default router;
