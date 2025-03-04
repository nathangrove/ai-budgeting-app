export interface IUser {
  _id: string;
  sub: string; // Subject identifier
  email?: string;
  password?: string;
  imapSettings?: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}