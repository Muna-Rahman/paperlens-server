import { Router } from 'express';
import { 
  getPapers, 
  getPaperById, 
  getRelatedPapers,
  createPaper, 
  deletePaper,
  getPapersMine
} from '../controllers/paper.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import reviewRoutes from './review.routes.js';

const router = Router();

router.get('/', getPapers);
router.get('/mine', requireAuth, getPapersMine);
router.post('/', requireAuth, createPaper);
router.delete('/:id', requireAuth, deletePaper);
router.get('/:id/related', getRelatedPapers);
router.use('/:id/reviews', reviewRoutes);
router.get('/:id', getPaperById);

export default router;