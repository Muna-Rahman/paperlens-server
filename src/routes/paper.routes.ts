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
import reviewRoutes from './review.routes';

const router = Router();

// Public Routes
router.get('/', getPapers);

router.get('/mine', requireAuth, getPapersMine);
router.post('/', requireAuth, createPaper);
router.delete('/:id', requireAuth, deletePaper);


router.get('/:id/related', getRelatedPapers);

// Reviews — GET is public, POST requires auth (enforced inside review.routes.ts)
router.use('/:id/reviews', reviewRoutes);

router.get('/:id', getPaperById);

export default router;