import { Router, Response, Request } from 'express';
import transactionService from '../services/transaction.service';
import { Error } from 'mongoose';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.createTransaction({ ...req.body, userId: req.session.user?._id });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactionsByUserId(req.session.user?._id as string);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
