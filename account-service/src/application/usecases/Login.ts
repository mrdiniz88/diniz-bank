import Account from "../../domain/entities/Account";
import BadRequest from "../../utils/errors/BadRequest";
import NotFound from "../../utils/errors/NotFound";
import validateRequiredFields from "../../utils/validate-fields/ValidateRequiredFields";
import AccountRepository from "../repositories/AccountRepository";
import UserRepository from "../repositories/UserRepository";

type Input = {
  email: string;
  password: string;
};

type Output = {
  account: {
    id: string;
    email: string;
    user: {
      fullName: string;
      document: string;
    };
    balance: number;
    isShopkeeper: Boolean;
  };
};

export default class Login {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    validateRequiredFields(
      input,
      {
        email: "string",
        password: "string",
      },
      ["email", "password"]
    );
    const account = await this.accountRepository.findByEmail(input.email);

    if (!account) throw new BadRequest("Invalid credentials");

    if (!account.validatePassword(input.password))
      throw new BadRequest("Invalid credentials");

    const user = await this.userRepository.findById(account.userId);

    if (!user) throw new NotFound("User not found");

    return {
      account: {
        id: account.id,
        isShopkeeper: account.isShopkeeper,
        balance: account.getBalance(),
        email: account.email,
        user: {
          fullName: user.fullName,
          document: user.document.getFormatedDocument(),
        },
      },
    };
  }
}
