import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import formsRouter from './routes/forms';
import paymentRouter from './routes/payment';
import submissionsRouter from './routes/submissions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pehle
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || ''
  ],
  credentials: true
}));
app.use(express.json());

// Routes baad mein
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.use('/api/auth', authRouter);
app.use('/api/forms', formsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/submissions', submissionsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});