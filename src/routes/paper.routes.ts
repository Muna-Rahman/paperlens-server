import { Router, Request, Response, NextFunction } from 'express';
import { getPapers, createPaper, getPaperById, deletePaper, getPapersMine } from '../controllers/paper.controller';
import { computeRelatedPapers } from '../services/similarity.service';
import requireAuth from '../middleware/requireAuth';

const router = Router();

// 1. Static global collections
router.get('/', getPapers);

// 2. FIXED: Placed user collection tracking node lookup above variable parameters
router.get('/mine', requireAuth as any, getPapersMine);

// 3. Dynamic analytics structural calculations engine
router.get('/:id/related', (req: Request, res: Response, next: NextFunction) => {
  computeRelatedPapers(req.params.id as string)
    .then((related) => {
      res.status(200).json({
        success: true,
        count: related.length,
        papers: related
      });
    })
    .catch((error) => {
      next(error);
    });
});

// 4. General fallback element profile lookups
router.get('/:id', getPaperById);

// 5. Authentication guarded layout adjustments
router.post('/', requireAuth, createPaper);
router.delete('/:id', requireAuth, deletePaper);

export default router;