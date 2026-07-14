import { Router } from 'express';
import { 
  getPapers, 
  getPaperById, 
  getRelatedPapers,
  createPaper, 
  deletePaper,
  getPapersMine
} from '../controllers/paper.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Public Routes
router.get('/', getPapers);

// Protected Routes
// IMPORTANT: '/mine' must be registered BEFORE '/:id',
// otherwise Express matches "mine" as an :id param and
// Mongoose throws "Cast to ObjectId failed for value 'mine'".
router.get('/mine', requireAuth, getPapersMine);
router.post('/', requireAuth, createPaper);
router.delete('/:id', requireAuth, deletePaper);

// Public dynamic routes — '/:id/related' must come BEFORE '/:id'
// for the same reason as '/mine' above (more specific route first).
router.get('/:id/related', getRelatedPapers);
router.get('/:id', getPaperById);

export default router;