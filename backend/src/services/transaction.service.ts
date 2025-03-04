import Transaction from '../models/Transaction';

class TransactionService {
  async createTransaction(data: any) {
    const transaction = new Transaction(data);
    await transaction.save();
    return transaction;
  }

  async getTransactionsByUserId(userId: string) {
    const transactions = await Transaction.find({ userId });
    return transactions;
  }
}

export default new TransactionService();
