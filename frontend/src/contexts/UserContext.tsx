import { createContext } from 'react';
import { IUser } from '../types/user';

export const UserContext = createContext({
  user: null as IUser | null,
  setUser: (user: any) => {},
});
