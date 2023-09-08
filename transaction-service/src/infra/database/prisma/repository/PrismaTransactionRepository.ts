import { PrismaClient } from "@prisma/client";
import TransactionRepositry from "../../../../application/repositories/TransactionRepository";
import Transaction from "../../../../domain/entities/Transaction";

export default class PrismaTransactionRepository
  implements TransactionRepositry
{
  constructor(private readonly prismaClient: PrismaClient) {}

  async save(transaction: Transaction): Promise<void> {
    await this.prismaClient.transaction.create({
      data: {
        id: transaction.id,
        amount: transaction.amount,
        receiverId: transaction.receiverId,
        senderId: transaction.senderId,
      },
    });
  }
}
