import User from '../models/User';


export const createUser = async (sub: string, email: string, password: string) => {
  const user = new User({
    sub,
    email,
    password,
  });

  await user.save();
  console.log('User created');
};

export const getUserCount = async () => {
  return await User.countDocuments();
};
