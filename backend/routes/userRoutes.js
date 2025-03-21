
import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/profile')
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

export default router;
