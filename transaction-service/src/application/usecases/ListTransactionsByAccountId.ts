import TransactionDAO from "../dao/TransactionDAO";

type Input = {
  accountId: string;
};

type Output = {
  transactions: {
    id: string;
    peerName: string;
    amount: string;
    action: "SENT" | "RECEIVED";
    createdAt: Date;
  }[];
};

export default class ListTransactionsByAccountId {
  constructor(private readonly transactionDAO: TransactionDAO) {}

  async execute({ accountId }: Input): Promise<Output> {
    const transactions = await this.transactionDAO.findMany({ accountId });

    const response: Output = { transactions: [] };

    transactions.forEach((transaction) => {
      if (transaction.senderId === accountId) {
        response.transactions.push({
          id: transaction.id,
          action: "SENT",
          amount: transaction.amount,
          peerName: transaction.receiverName,
          createdAt: transaction.createdAt,
        });
      }

      if (transaction.receiverId === accountId) {
        response.transactions.push({
          id: transaction.id,
          action: "RECEIVED",
          amount: transaction.amount,
          peerName: transaction.senderName,
          createdAt: transaction.createdAt,
        });
      }
    });
    
    return response;
  }
}
