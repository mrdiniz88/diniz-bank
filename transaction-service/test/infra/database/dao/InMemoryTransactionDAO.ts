import TransactionDAO, {
  Filters,
} from "../../../../src/application/dao/TransactionDAO";

export default class InMemoryTransactionDAO implements TransactionDAO {
  constructor(private readonly transactionDatabase: any[]) {}

  async findMany(filters?: Filters): Promise<any[]> {
    return this.transactionDatabase.map((transaction) => {
      if (
        transaction.senderId === filters?.accountId ||
        transaction.receiverId === filters?.accountId
      )
        return {
          id: transaction.id,
          receiverId: transaction.receiverId,
          senderId: transaction.senderId,
          receiverName: transaction.receiverName,
          senderName: transaction.senderName,
          amount: transaction.amount,
          status: transaction.status,
          createdAt: transaction.createdAt,
        };
    });
  }
}
