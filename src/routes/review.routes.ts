import { Router } from 'express';
import { getReviews, createReview } from '../controllers/review.controller';
import { requireAuth } from '../middleware/requireAuth';

// mergeParams lets this router read ':id' from the parent path it gets
// mounted under in paper.routes.ts (i.e. /papers/:id/reviews).
const router = Router({ mergeParams: true });

// GET /api/papers/:id/reviews — Public
router.get('/', getReviews);

// POST /api/papers/:id/reviews — Logged In
router.post('/', requireAuth, createReview);

export default router;