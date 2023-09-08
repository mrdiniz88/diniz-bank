import { PrismaClient } from "@prisma/client";
import ApproveTransaction from "../../application/usecases/ApproveTransaction";
import PrismaTransactionRepository from "../database/prisma/repository/PrismaTransactionRepository";
import Queue from "./Queue";
import RabbitMQAdapter from "./RabbitMQAdapter";

export default class QueueController {
  constructor(queue: Queue, approveTransaction: ApproveTransaction) {
    queue.on("ApproveTransaction", async (event: any) => {
      await approveTransaction.execute({
        amount: event.amount,
        receiverId: event.receiverId,
        senderId: event.senderId,
      });
    });
  }
}

(async function main() {
  const prismaClient = new PrismaClient();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.assertExchange("DoTransaction", "fanout");
  await queue.assertExchange("DLX.ApproveTransaction", "fanout");
  await queue.assertExchange("ApproveTransaction", "direct");

  await queue.assertQueue("ApproveTransaction", {
    durable: true,
    deadLetterExchange: "DLX.ApproveTransaction",
    deadLetterRoutingKey: "DLK.ApproveTransaction",
  });
  await queue.assertQueue("TransactionApproved", {
    durable: true,
    deadLetterExchange: "DLX.TransactionApproved",
    deadLetterRoutingKey: "DLK.TransactionApproved",
  });
  await queue.assertQueue("TransactionDenied", { durable: true });

  await queue.bindQueue("ApproveTransaction", "DoTransaction", "");

  const approveTransaction = new ApproveTransaction(
    new PrismaTransactionRepository(prismaClient),
    queue
  );

  new QueueController(queue, approveTransaction);

  console.log("Consumer is running");
})();

// {"amount": 4, "senderId":"1", "receiverId": "2"}
