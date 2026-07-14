import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { auth } from '../lib/auth'; // Imports your Better Auth instance cleanly

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Missing required credential fields.' });
      return;
    }

    // Pass the payload directly to Better Auth's core sign-up system
    const sessionData = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: sessionData.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password fields are mandatory.' });
      return;
    }

    // Authenticate through Better Auth's sign-in handler system
    const sessionData = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    res.status(200).json({
      message: 'Login successful',
      user: sessionData.user,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Invalid credentials.' });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Revoke the browser token cookies securely
    await auth.api.signOut({
      headers: req.headers as any,
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};