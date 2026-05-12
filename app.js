import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
const app = express();

//Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://marveltechhub.vercel.app',
  credentials: true
}))
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes)
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

export default app;