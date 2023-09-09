import Transaction from "../../domain/entities/Transaction";
import Queue from "../../infra/queue/Queue";
import TransactionRepositry from "../repositories/TransactionRepository";
import axios, { AxiosError } from "axios";
import AccountHolder from "../../domain/entities/AccountHolder";
import InternalServerError from "../../utils/errors/InternalServerError";

type Input = {
  senderId: string;
  receiverId: string;
  amount: number;
  senderName: string;
  receiverName: string;
};

export default class ApproveTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepositry,
    private readonly queue: Queue
  ) {}

  async execute(input: Input) {
    const sender = new AccountHolder(input.senderId, input.senderName);
    const receiver = new AccountHolder(input.receiverId, input.receiverName);

    const transaction = Transaction.create(sender, receiver, input.amount);

    await this.transactionRepository.save(transaction);

    try {
      await axios.post(
        "https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6"
      );

      await this.queue.publish("ApproveTransaction", {
        payload: {
          receiverId: receiver.id,
          amount: transaction.amount,
          senderId: sender.id,
        },
        routingKey: "TransactionApproved",
      });

      transaction.approved();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 500) {
          transaction.error();
          await this.transactionRepository.update(transaction);
          throw new InternalServerError("Axios response 500");
        }

        transaction.denied();
      }

      await this.queue.publish("ApproveTransaction", {
        payload: {
          senderId: input.senderId,
          amount: input.amount,
        },
        routingKey: "TransactionDenied",
      });
    }

    await this.transactionRepository.update(transaction);
  }
}
