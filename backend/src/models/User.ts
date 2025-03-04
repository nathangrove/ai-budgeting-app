import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  sub: string; // Subject identifier
  email?: string;
  password?: string;
  imapSettings?: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  sub: { type: String, required: true, unique: true, sparse: true },
  password: { type: String },
  email: { type: String, unique: true, sparse: true },
  imapSettings: {
    host: { type: String },
    port: { type: Number },
    user: { type: String },
    password: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  if (this.password) this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
