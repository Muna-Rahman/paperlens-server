import { Router, Request, Response, NextFunction } from 'express';
import { getPapers, createPaper } from '../controllers/paper.controller';
import { computeRelatedPapers } from '../services/similarity.service';

const router = Router();

router.get('/', getPapers);
router.post('/', createPaper);

// NEW ENGINE ROUTE MAP: Fetch top 4 matched documents
router.get('/:id/related', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const related = await computeRelatedPapers(id as any);
    
    res.status(200).json({
      success: true,
      count: related.length,
      papers: related
    });
  } catch (error) {
    next(error);
  }
});

export default router;