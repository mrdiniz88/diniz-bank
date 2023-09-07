import TransactionApproved from "../../application/usecases/TransactionApproved";
import TransactionDenied from "../../application/usecases/TransactionDenied";
import Queue from "./Queue";

export default class QueueController {
  constructor(
    queue: Queue,
    transactionApproved: TransactionApproved,
    transactionDenied: TransactionDenied
  ) {
    queue.on("TransactionApproved", async (event: any) => {
      await transactionApproved.execute({
        amount: event.amount,
        receiverId: event.receiverId,
        senderId: event.senderId,
      });
    });

    queue.on("TransactionDenied", async (event: any) => {
      await transactionDenied.execute({
        amount: event.amount,
        senderId: event.senderId,
      });
    });
  }
}
