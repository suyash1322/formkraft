import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed }
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Wrong password' });
      return;
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;