import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import storeRouter from './routes/store';
import bankRouter from './routes/bank';
import campaignRouter from './routes/campaign';
import uploadRouter from './routes/upload';
import categoryRouter from './routes/category';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to ensure database is connected before any request
const connectDatabase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connected successfully on-demand.");
    }
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ message: 'Internal Server Error - Could not connect to database' });
  }
};

// Use the middleware for ALL requests
app.use(connectDatabase);

// --- Routes ---
app.get('/', (req, res) => {
  res.send('API Çalışıyor!');
});

// Test endpoint - Environment variables kontrol
app.get('/test-env', (req, res) => {
  res.json({
    postgresUrl: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    postgresUrlValue: process.env.POSTGRES_URL || 'NOT SET',
    vercel: process.env.VERCEL ? 'YES' : 'NO',
    nodeEnv: process.env.NODE_ENV,
    appDataSourceType: AppDataSource.options.type,
    appDataSourceUrl: AppDataSource.options.url
  });
});

app.use('/api/auth', authRouter);
app.use('/api/store', storeRouter);
app.use('/api/bank', bankRouter);
app.use('/api/campaign', campaignRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/category', categoryRouter);
// Static file serving - Vercel'de /tmp, local'de uploads
const uploadsPath = process.env.VERCEL 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Start server only if not in Vercel environment
if (!process.env.VERCEL) {
  const PORT = parseInt(process.env.PORT || '5008');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel expects a default export of the app
export default app; 