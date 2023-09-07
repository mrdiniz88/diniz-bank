import Queue from "../../infra/queue/Queue";
import NotFound from "../../utils/errors/NotFound";
import AccountRepository from "../repositories/AccountRepository";
import validateRequiredFields from "../../utils/validate-fields/ValidateRequiredFields";

type Input = {
  senderId: string;
  receiverId: string;
  amount: number;
};

export default class DoTransaction {
  constructor(
    private readonly accountRepository: AccountRepository,
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

    const receiver = await this.accountRepository.findById(input.receiverId);

    if (!receiver) throw new NotFound("Receiver not found");

    sender.debit(input.amount);

    await this.queue.publish("DoTransaction", {
      payload: {
        senderId: sender.id,
        receiverId: receiver.id,
        amount: input.amount,
      },
    });

    await this.accountRepository.update(sender);
  }
}
