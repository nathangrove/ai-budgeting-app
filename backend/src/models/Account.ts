import mongoose from 'mongoose';

interface IAccount {
  name: string;
  type: 'bank' | 'credit' | 'charge';
  balance: number;
  userId: mongoose.Schema.Types.ObjectId;
  number: string;
  institution: string;
}

const accountSchema = new mongoose.Schema<IAccount>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['bank', 'credit', 'charge'],
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
