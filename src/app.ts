import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node'; // Fixed: Official adapter for Express/Node.js compatibility
import authRoutes from './routes/auth.routes';
import paperRoutes from './routes/paper.routes';
import { auth } from './lib/auth'; 

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// FIXED: Using app.use() matches prefixes natively (e.g., /api/auth/signup, /api/auth/login)
// This completely circumvents path-to-regexp wildcard parsing issues and drops the PathError crash.
// toNodeHandler bridges Express objects seamlessly to resolve the 1-argument TypeScript mismatch.
app.use('/api/auth', toNodeHandler(auth));

// Active structural API routes
app.use('/api/auth', authRoutes);
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