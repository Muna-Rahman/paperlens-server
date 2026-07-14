import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (requires authentication)
router.post('/logout', requireAuth, logout);

export default router;