import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import requireAuth from '../middleware/requireAuth'; // FIXED: Changed to default import style

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;