import TransactionRepository from "../../../../src/application/repositories/TransactionRepository";
import Transaction from "../../../../src/domain/entities/Transaction";

export default class InMemoryTransactionRepository
  implements TransactionRepository
{
  constructor(private readonly transactionDatabase: any[]) {}

  async save(transaction: Transaction): Promise<void> {
    this.transactionDatabase.push({
      id: transaction.id,
      amount: transaction.amount,
      senderId: transaction.sender.id,
      senderName: transaction.sender.name,
      receiverId: transaction.receiver.id,
      receiverName: transaction.receiver.name,
      status: transaction.getStatus(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.getLastUpdate(),
    });
  }

  async update(transaction: Transaction): Promise<void> {
    const index = this.transactionDatabase.findIndex(
      ({ id }) => transaction.id === id
    );

    this.transactionDatabase[index].status = transaction.getStatus();
    this.transactionDatabase[index].updatedAt = transaction.getLastUpdate();
  }
}
