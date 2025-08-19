import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import workRoutes from './routes/works.js';
import jobsRoutes from './routes/jobs.js';
import proposalsRoutes from './routes/proposals.js';
import txRoutes from './routes/transactions.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Freelance Marketplace API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/works', workRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 8080;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
