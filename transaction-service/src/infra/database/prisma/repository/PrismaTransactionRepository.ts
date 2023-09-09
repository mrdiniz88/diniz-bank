import { PrismaClient } from "@prisma/client";
import TransactionRepositry from "../../../../application/repositories/TransactionRepository";
import Transaction from "../../../../domain/entities/Transaction";

export default class PrismaTransactionRepository
  implements TransactionRepositry
{
  constructor(private readonly prismaClient: PrismaClient) {}

  async update(transaction: Transaction): Promise<void> {
    await this.prismaClient.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: transaction.getStatus(),
        updatedAt: transaction.getLastUpdate(),
      },
    });
  }

  async save(transaction: Transaction): Promise<void> {
    await this.prismaClient.transaction.create({
      data: {
        id: transaction.id,
        amount: transaction.amount,
        receiverId: transaction.receiver.id,
        receiverName: transaction.receiver.name,
        senderId: transaction.sender.id,
        senderName: transaction.sender.name,
        createdAt: transaction.createdAt,
        status: transaction.getStatus(),
        updatedAt: transaction.getLastUpdate(),
      },
    });
  }
}
