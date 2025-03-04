import { Router, Response, Request } from 'express';
import Account from '../models/Account';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const account = new Account({ 
      ...req.body, 
      userId: req.session.user?._id 
    });
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find({ 
      userId: req.session.user?._id 
    });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.session.user?._id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user?._id },
      req.body,
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ error: (error as Error)?.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, userId: req.session.user?._id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
