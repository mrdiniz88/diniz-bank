import { PrismaClient } from "@prisma/client";
import TransactionDAO, {
  Filters,
} from "../../../../application/dao/TransactionDAO";

export default class PrismaTransactionDAO implements TransactionDAO {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findMany({ accountId }: Filters): Promise<any> {
    const transactions = await this.prismaClient.transaction.findMany({
      where: {
        OR: [
          {
            senderId: accountId,
          },
          {
            receiverId: accountId,
          },
        ],
      },
      select: {
        id: true,
        receiverId: true,
        senderId: true,
        receiverName: true,
        senderName: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });

    return transactions;
  }
}
