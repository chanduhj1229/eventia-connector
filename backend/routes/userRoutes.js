
import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile,
  getUserLogs
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/profile')
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

// Logs endpoints
router.get('/logs', protect, getUserLogs);

export default router;
