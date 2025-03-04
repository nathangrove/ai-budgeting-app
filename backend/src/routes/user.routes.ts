import express from 'express';
import User from '../models/User';

const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.send('Logout successful');
  });
});

// Check if logged in route
router.get('/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post('/settings', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { imapUser, imapPassword, imapHost, imapPort } = req.body;
  const user = await User.findById(req.session.user.id);
  if (user) {
    user.imapSettings = { 
      user: imapUser, 
      password: imapPassword, 
      host: imapHost, 
      port: imapPort 
    };
    await user.save();
    res.json({ message: 'Settings saved', user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
