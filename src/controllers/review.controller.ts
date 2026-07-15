import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review.js';
import Paper from '../models/Paper.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

/**
 * Retrieve every review submitted for a given paper, newest first.
 * Public — guests can read reviews, only logged-in users can post them.
 */
export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // paperId, inherited from the parent /papers/:id/reviews route

    const reviews = await Review.find({ paperId: id }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a new review for a paper. Requires an authenticated session.
 */
export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // paperId
    const userId = req.user?.id;
    const userName = req.user?.name || 'Anonymous Reviewer';

    if (!userId) {
      res.status(401).json({ success: false, message: 'You must be signed in to submit a review.' });
      return;
    }

    const paperExists = await Paper.exists({ _id: id });
    if (!paperExists) {
      res.status(404).json({ success: false, message: 'Target paper not found.' });
      return;
    }

    const { rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
      return;
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      res.status(400).json({ success: false, message: 'Review comment cannot be empty.' });
      return;
    }

    const review = await Review.create({
      paperId: id,
      userId: String(userId),
      userName,
      rating: numericRating,
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Review published.',
      review,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};