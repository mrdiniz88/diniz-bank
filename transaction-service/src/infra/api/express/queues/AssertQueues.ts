import ApproveTransaction from "../../../../application/usecases/ApproveTransaction";
import QueueController from "../../../queue/QueueController";
import RabbitMQAdapter from "../../../queue/RabbitMQAdapter";
import { transactionRepository } from "../app";

export const queue = new RabbitMQAdapter();

export const assertQueues = async () => {
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
    transactionRepository,
    queue
  );

  new QueueController(queue, approveTransaction);

  console.log("Consumer is running");
};
