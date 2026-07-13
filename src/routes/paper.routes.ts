import { Router } from 'express';
import { getPapers, createPaper } from '../controllers/paper.controller';

const router = Router();

// Ensure both handlers are valid, loaded functions passed into the route map
router.get('/', getPapers);
router.post('/', createPaper);

export default router;