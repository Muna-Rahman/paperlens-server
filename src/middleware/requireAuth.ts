import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';

// FIX: Tells TypeScript to extend Express Request to allow the user object
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Better Auth reads cookies/tokens straight out of the request headers[cite: 1]
    const session = await auth.api.getSession({ 
      headers: fromNodeHeaders(req.headers) 
    });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user information to the request context[cite: 1]
    req.user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};