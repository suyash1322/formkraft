import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { forms: true }
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    if (user.plan === 'FREE' && user.forms.length >= 3) {
      res.status(403).json({ error: 'Upgrade to Pro for unlimited forms' }); return;
    }
    const form = await prisma.form.create({
      data: { title: req.body.title, fields: req.body.fields ?? [], userId: req.userId! }
    });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create form' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const forms = await prisma.form.findMany({ where: { userId: req.userId! } });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id as string, userId: req.userId! }
    });
    if (!form) { res.status(404).json({ error: 'Form not found' }); return; }
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const form = await prisma.form.updateMany({
      where: { id: req.params.id as string, userId: req.userId! },
      data: { title: req.body.title, fields: req.body.fields }
    });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update form' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.form.deleteMany({
      where: { id: req.params.id as string, userId: req.userId! }
    });
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

export default router;