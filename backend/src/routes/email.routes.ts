import express from 'express';
import User, { IUser } from '../models/User';
import * as emailService from '../services/email.service';
import * as openaiService from '../services/openai.service';
import accountService from '../services/account.service';
import transactionService from '../services/transaction.service';

const router = express.Router();

router.get('/check', async (req, res) => {
  const user = await User.findById(req.session.user?.id);
  if (user && user.imapSettings) {
    try {
      // Connect to IMAP server using user's settings
      const imapConnection = await emailService.connect(user.imapSettings);
      if (!imapConnection) {
        console.error('Failed to connect to IMAP server');
        return res.status(500).json({ message: 'Failed to connect to IMAP server' });
      }

      const emails = await emailService.parse(imapConnection);
      // Analyze emails using Ollama service
      const analysis = await openaiService.analyzeEmails(emails, req.session.user as IUser);

      // insert transactions
      for (const email of analysis) {
        const account = await accountService.findAccount(
          req.session.user?._id as string, 
          email.analysis?.institution as string, 
          email.analysis?.account as string
        );

        if (!account) {
          email.error = 'Account not found';
          continue;
        }
        // insert the transaction into the database
        await transactionService.createTransaction({
          accountId: account._id,
          userId: req.session.user?._id as string ?? '',
          description: email.analysis?.vendor,
          amount: Number(email.analysis?.amount.toString().replace(/[^0-9.-]+/g, '')),
          date: new Date(),
          rawEmailContents: email.raw,
        }).catch((error) => {
          console.error('Error inserting transaction:', error);
          email.error = 'Error inserting transaction';
        });

        // update the account balance
        await accountService.updateAccountBalanceByDelta(
          account._id.toString(),
          Number(email.analysis?.amount.toString().replace(/[^0-9.-]+/g, '')) * -1
        ).catch((error) => {
          console.error('Error updating account balance:', error);
          email.error = 'Error updating account balance';
        });
      }

      res.json({ message: 'Emails fetched and analyzed successfully', analysis });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch emails', error });
    }
  } else {
    console.log('user', user);
    res.status(404).json({ message: 'User not found or IMAP settings missing' });
  }
});

export default router;
