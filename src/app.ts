import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/auth.routes';
import paperRoutes from './routes/paper.routes';

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

export default app;