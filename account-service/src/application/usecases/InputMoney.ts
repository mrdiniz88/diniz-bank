import AccountRepository from "../repositories/AccountRepository";
import NotFound from "../../utils/errors/NotFound";
import validateRequiredFields from "../../utils/validate-fields/ValidateRequiredFields";

type Input = {
  id: string;
  amount: number;
};

export default class InputMoney {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: Input) {
    validateRequiredFields(input, { id: "string", amount: "number" }, [
      "id",
      "amount",
    ]);

    const account = await this.accountRepository.findById(input.id);

    if (!account) throw new NotFound("Account not foun");

    account.credit(input.amount);

    await this.accountRepository.update(account);
  }
}
