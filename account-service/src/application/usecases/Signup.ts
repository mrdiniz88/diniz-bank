import Account from "../../domain/entities/Account";
import User from "../../domain/entities/User";
import Document from "../../domain/value-objects/Document";
import Password from "../../domain/value-objects/Password";
import BadRequest from "../../utils/errors/BadRequest";
import validateRequiredFields from "../../utils/validate-fields/ValidateRequiredFields";
import AccountRepository from "../repositories/AccountRepository";
import UserRepository from "../repositories/UserRepository";

type Input = {
  fullName: string;
  email: string;
  password: string;
  document: string;
  isShopkeeper: boolean;
};

export default class Signup {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input) {
    validateRequiredFields(
      input,
      {
        fullName: "string",
        email: "string",
        password: "string",
        document: "string",
        isShopkeeper: "boolean",
      },
      ["fullName", "email", "password", "document", "isShopkeeper"]
    );

    const emailAlreadyUsed = await this.accountRepository.findByEmail(
      input.email
    );

    if (emailAlreadyUsed) throw new BadRequest("Invalid credentials");

    const alreadyUsedDocument = await this.userRepository.findByDocument(
      input.document
    );

    if (alreadyUsedDocument) throw new BadRequest("Invalid credentials");

    const user = User.create(input.fullName, new Document(input.document));

    const account = Account.create(
      user.id,
      input.email,
      input.isShopkeeper,
      Password.create(input.password, String(process.env.SALT))
    );

    await this.userRepository.save(user);
    await this.accountRepository.save(account);
  }
}
