import { Router } from 'express';
import { 
  getPapers, 
  getPaperById, 
  createPaper, 
  deletePaper,
  getPapersMine // Corrected: matches the exact function name in your controller
} from '../controllers/paper.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Public Routes
router.get('/', getPapers);
router.get('/:id', getPaperById);

// Protected Routes
router.post('/', requireAuth, createPaper);
router.get('/mine', requireAuth, getPapersMine); // Corrected function call
router.delete('/:id', requireAuth, deletePaper);

export default router;