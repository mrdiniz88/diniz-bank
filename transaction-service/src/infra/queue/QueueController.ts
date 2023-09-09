import { PrismaClient } from "@prisma/client";
import ApproveTransaction from "../../application/usecases/ApproveTransaction";
import PrismaTransactionRepository from "../database/prisma/repository/PrismaTransactionRepository";
import Queue from "./Queue";
import RabbitMQAdapter from "./RabbitMQAdapter";

export default class QueueController {
  constructor(queue: Queue, approveTransaction: ApproveTransaction) {
    queue.on("ApproveTransaction", async (event: any) => {
      await approveTransaction.execute({
        receiverName: event.receiverName,
        senderName: event.receiverName,
        amount: event.amount,
        receiverId: event.receiverId,
        senderId: event.senderId,
      });
    });
  }
}
