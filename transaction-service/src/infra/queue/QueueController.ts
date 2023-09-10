import ApproveTransaction from "../../application/usecases/ApproveTransaction";
import Queue from "./Queue";

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
