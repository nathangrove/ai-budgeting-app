import Account from '../models/Account';

class AccountService {
  async findAccount(userId: string, institution: string, number: string) {
    const account = await Account.findOne({ userId, institution, number });
    return account;
  }

  async updateAccountBalance(userId: string, institution: string, number: string, newBalance: number) {
    const account = await Account.findOneAndUpdate(
      { userId, institution, number },
      { balance: newBalance },
      { new: true }
    );
    return account;
  }

  async updateAccountBalanceByDelta(accountId: string, balanceDelta: number) {
    const account = await Account.findById(accountId);
    if (account) {
      account.balance += balanceDelta;
      await account.save();
    }
    return account;
  }

  async findAccountsByUserId(userId: string) {
    const accounts = await Account.find({ userId });
    return accounts;
  }
}

export default new AccountService();
