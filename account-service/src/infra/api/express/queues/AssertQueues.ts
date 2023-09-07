import TransactionApproved from "../../../../application/usecases/TransactionApproved";
import TransactionDenied from "../../../../application/usecases/TransactionDenied";
import QueueController from "../../../queue/QueueController";
import RabbitMQAdapter from "../../../queue/RabbitMQAdapter";
import { accountRepository, userRepository } from "../app";

export const queue = new RabbitMQAdapter();

export const assertQueues = async () => {
  await queue.connect();
  await queue.assertExchange("DoTransaction", "fanout");
  await queue.assertExchange("DLX.TransactionApproved", "fanout");
  await queue.assertExchange("SendNotification", "direct");
  await queue.assertExchange("ApproveTransaction", "direct");
  await queue.assertExchange("DLX.ApproveTransaction", "fanout");

  await queue.assertQueue("SendEmail", { durable: true, messageTtl: 60000 });
  await queue.assertQueue("TransactionApproved", {
    durable: true,
    deadLetterExchange: "DLX.TransactionApproved",
    deadLetterRoutingKey: "DLK.TransactionApproved",
  });

  await queue.assertQueue("TransactionDenied", { durable: true });

  await queue.bindQueue("ApproveTransaction", "DoTransaction", "");
  await queue.bindQueue(
    "TransactionApproved",
    "ApproveTransaction",
    "TransactionApproved"
  );
  await queue.bindQueue(
    "TransactionDenied",
    "ApproveTransaction",
    "TransactionDenied"
  );
  await queue.bindQueue(
    "TransactionDenied",
    "DLX.ApproveTransaction",
    "DLK.ApproveTransaction"
  );

  const transactionApproved = new TransactionApproved(
    accountRepository,
    userRepository,
    queue
  );

  const transactionDenied = new TransactionDenied(accountRepository);

  new QueueController(queue, transactionApproved, transactionDenied);

  console.log("Consumer is running");
};
