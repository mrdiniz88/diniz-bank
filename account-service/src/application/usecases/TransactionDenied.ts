import NotFound from "../../utils/errors/NotFound";
import AccountRepository from "../repositories/AccountRepository";

type Input = {
  senderId: string;
  amount: number;
};

export default class TransactionDenied {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: Input) {
    const sender = await this.accountRepository.findById(input.senderId);

    if (!sender) throw new NotFound("Sender not found");

    sender.credit(input.amount);

    await this.accountRepository.update(sender);
  }
}
