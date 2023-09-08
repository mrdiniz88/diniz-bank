import Transaction from "../../domain/entities/Transaction";
import Queue from "../../infra/queue/Queue";
import TransactionRepositry from "../repositories/TransactionRepository";
import axios from "axios";

type Input = {
  senderId: string;
  receiverId: string;
  amount: number;
};

export default class ApproveTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepositry,
    private readonly queue: Queue
  ) {}

  async execute(input: Input) {
    const response = await axios.post(
      "https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6"
    );

    if (response.data.message === "Autorizado") {
      const transaction = Transaction.create(
        input.senderId,
        input.receiverId,
        input.amount
      );

      await this.transactionRepository.save(transaction);

      await this.queue.publish("ApproveTransaction", {
        payload: {
          receiverId: input.receiverId,
          amount: input.amount,
          senderId: input.senderId,
        },
        routingKey: "TransactionApproved",
      });

      return;
    }

    await this.queue.publish("ApproveTransaction", {
      payload: {
        senderId: input.senderId,
        amount: input.amount,
      },
      routingKey: "TransactionDenied",
    });
  }
}
