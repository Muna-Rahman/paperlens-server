import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ 
      headers: fromNodeHeaders(req.headers) 
    });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};