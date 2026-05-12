import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

// 1. Body parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. CORS NEXT (important for cookies + frontend)
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://marveltechhub.vercel.app',
  credentials: true
}));

// 3. Routes LAST
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

export default app;