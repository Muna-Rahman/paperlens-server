import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function requireAuth(req: any, res: Response, next: NextFunction): void {
  // Read token from cookies or authorization headers
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication session token missing." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    
    // FIXED: Normalize both .id and ._id variations so controller layers don't parse undefined values
    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Session token signature is invalid." });
  }
}