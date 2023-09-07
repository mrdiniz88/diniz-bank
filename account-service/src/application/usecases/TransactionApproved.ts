import Queue from "../../infra/queue/Queue";
import NotFound from "../../utils/errors/NotFound";
import AccountRepository from "../repositories/AccountRepository";
import UserRepository from "../repositories/UserRepository";

type Input = {
  receiverId: string;
  senderId: string;
  amount: number;
};

export default class TransactionApproved {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
    private readonly queue: Queue
  ) {}

  async execute(input: Input) {
    const receiver = await this.accountRepository.findById(input.receiverId);
    if (!receiver) throw new NotFound("Receiver not found");

    receiver.credit(input.amount);

    await this.accountRepository.update(receiver);

    const sender = await this.accountRepository.findById(input.senderId);

    if (!sender) throw new NotFound("Sender not found");

    const user = await this.userRepository.findById(sender.userId);

    await this.queue.publish("SendNotification", {
      payload: {
        email: receiver.email,
        body: `Você recebeu uma transação no valor de ${input.amount}R$ de ${user?.fullName}`,
      },
      routingKey: "Email",
    });
  }
}
