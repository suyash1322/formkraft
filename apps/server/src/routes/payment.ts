import { Router, Response, Request } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import express from 'express';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Order create karo
router.post('/create-order', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      receipt: `receipt_${req.userId}`,
      notes: {
        userId: req.userId!
      }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Payment verify karo
router.post('/verify', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    // Plan PRO karo
    await prisma.user.update({
      where: { id: req.userId! },
      data: { plan: 'PRO' }
    });

    res.json({ success: true, message: 'Payment verified! Plan upgraded to PRO.' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Webhook — Razorpay se automatic events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    const event = JSON.parse(body.toString());

    if (event.event === 'payment.captured') {
      const userId = event.payload.payment.entity.notes?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO' }
        });
      }
    }

    if (event.event === 'refund.created') {
      const userId = event.payload.payment.entity.notes?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'FREE' }
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: 'Webhook failed' });
  }
});

export default router;