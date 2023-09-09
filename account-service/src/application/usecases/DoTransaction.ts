import Queue from "../../infra/queue/Queue";
import NotFound from "../../utils/errors/NotFound";
import AccountRepository from "../repositories/AccountRepository";
import validateRequiredFields from "../../utils/validate-fields/ValidateRequiredFields";
import UserRepository from "../repositories/UserRepository";

type Input = {
  senderId: string;
  receiverId: string;
  amount: number;
};

export default class DoTransaction {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
    private readonly queue: Queue
  ) {}

  async execute(input: Input) {
    validateRequiredFields(
      input,
      {
        senderId: "string",
        receiverId: "string",
        amount: "number",
      },
      ["senderId", "receiverId", "amount"]
    );

    const sender = await this.accountRepository.findById(input.senderId);

    if (!sender) throw new NotFound("Sender not found");

    sender.debit(input.amount);

    const receiver = await this.accountRepository.findById(input.receiverId);

    if (!receiver) throw new NotFound("Receiver not found");

    const senderUser = await this.userRepository.findById(sender.userId);
    const receiverUser = await this.userRepository.findById(receiver.userId);

    await this.queue.publish("DoTransaction", {
      payload: {
        senderId: sender.id,
        receiverId: receiver.id,
        amount: input.amount,
        receiverName: receiverUser?.fullName,
        senderName: senderUser?.fullName,
      },
    });

    await this.accountRepository.update(sender);
  }
}
