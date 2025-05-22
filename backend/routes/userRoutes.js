
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
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);
router.get('/logs', protect, getUserLogs);

export default router;
