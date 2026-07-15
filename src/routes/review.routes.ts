import { Router } from 'express';
import { getReviews, createReview } from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router({ mergeParams: true });

router.get('/', getReviews);
router.post('/', requireAuth, createReview);

export default router;