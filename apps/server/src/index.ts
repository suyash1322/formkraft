import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import formsRouter from './routes/forms';
import paymentRouter from './routes/payment';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use('/api/payment', paymentRouter);
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.use('/api/auth', authRouter);
app.use('/api/forms', formsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});