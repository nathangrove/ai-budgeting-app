export interface Account {
  _id: string;
  name: string;
  type: 'bank' | 'credit' | 'charge';
  balance: number;
  userId: string;
  number: string;
  institution: string;
}
