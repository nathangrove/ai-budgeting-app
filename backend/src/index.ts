import express from 'express';
import mongoose from 'mongoose';
import session, { SessionData } from 'express-session';
import userRoutes from './routes/user.routes';
import emailRoutes from './routes/email.routes';
import transactionRoutes from './routes/transaction.routes';
// import budgetRoutes from './routes/budget.routes';
import dotenv from 'dotenv';
import passport from 'passport';
import { configurePassport } from './services/passport.service';
import accountRoutes from './routes/account.routes';
import { IUser } from 'models/User';
import { createUser, getUserCount } from './services/user.service';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import morgan from 'morgan';

declare module 'express-session' {
  interface SessionData {
    user: IUser;
  }
}
// Augment the Express Request interface
declare global {
  namespace Express {
    interface User extends IUser {
    }
  }
}

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
redisClient.connect().catch(console.error)

// Initialize session middleware
app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:', // Optional: prefix for session keys in Redis
    ttl: 86400, // 1 day in seconds
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport
app.use(passport.initialize());
configurePassport(passport);

app.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login', 
  failureMessage: true 
}), async (req, res) => {
    res.json({ message: 'Login successful', user: req.session.user });
});

app.use(passport.session());
// Initialize morgan logger middleware
app.use(morgan('combined'));

app.use(express.json());
app.use('/api', userRoutes);

app.use(passport.session());

app.use('/api/email', emailRoutes);
app.use('/api/transactions', transactionRoutes);
// app.use('/api/budgets', budgetRoutes);
app.use('/api/accounts', accountRoutes);

const mongoUri = process.env.MONGO_URI || `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}`;

mongoose.connect(mongoUri).then(async () => {
  console.log('Connected to MongoDB');

  const userCount = await getUserCount();
  if (userCount === 0) {
    await createUser('admin', 'admin@example.com', 'password123');
    console.log('User seeded');
  } else {
    console.log('Users already exist, skipping seeding');
  }
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
