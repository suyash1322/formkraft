import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/:formId/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const formId = req.params.formId as string;

    const form = await prisma.form.findUnique({
      where: { id: formId }
    });

    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    const submission = await prisma.submission.create({
      data: {
        formId: formId,
        data: req.body.data
      }
    });

    res.json({ success: true, submissionId: submission.id });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed' });
  }
});

router.get('/:formId/public', async (req: Request, res: Response): Promise<void> => {
  try {
    const formId = req.params.formId as string;

    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, title: true, fields: true }
    });

    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

router.get('/:formId/responses', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const formId = req.params.formId as string;

    const form = await prisma.form.findFirst({
      where: { id: formId, userId: req.userId! }
    });

    if (!form) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const submissions = await prisma.submission.findMany({
      where: { formId: formId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

export default router;