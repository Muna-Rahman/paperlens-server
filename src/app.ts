import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { auth } from './lib/auth';
import paperRoutes from './routes/paper.routes';

const app = express();

// 1. CORS & Better Auth must come first
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

let authHandlerPromise: Promise<express.RequestHandler> | null = null;

function getAuthHandler(): Promise<express.RequestHandler> {
  if (!authHandlerPromise) {
    authHandlerPromise = import('better-auth/node').then(({ toNodeHandler }) => toNodeHandler(auth));
  }
  return authHandlerPromise;
}

app.use('/api/auth', async (req, res, next) => {
  try {
    const handler = await getAuthHandler();
    handler(req, res, next);
  } catch (err) {
    next(err);
  }
}); // Handles native /api/auth/sign-in/email, etc.

// 2. Standard parsers for the rest of your app routes
app.use(express.json());
app.use(cookieParser());

// 3. Application routes
app.use('/api/papers', paperRoutes);

// Graceful Root Fallback: Prevents 404s if client navigation slips to the backend port directly
app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

// Inline Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;