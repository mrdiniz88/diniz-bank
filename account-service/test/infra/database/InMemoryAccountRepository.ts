import AccountRepository from "../../../src/application/repositories/AccountRepository";
import Account from "../../../src/domain/entities/Account";
import Password from "../../../src/domain/value-objects/Password";

export default class InMemoryAccountDatabase implements AccountRepository {
  private accountDatabase = new Map<string, { [key: string]: any }>();

  async findByEmail(email: string): Promise<Account | null> {
    let response = undefined;

    this.accountDatabase.forEach((account) => {
      if (account.email === email) {
        response = account;
      }
    });

    if (!response) return null;

    return new Account(
      response["id"],
      response["userId"],
      response["email"],
      response["balance"],
      response["isShopkeeper"],
      new Password(response["password"], String(process.env.SALT))
    );
  }

  async findById(id: string): Promise<Account | null> {
    const response = this.accountDatabase.get(id);

    if (!response) return null;

    return new Account(
      response["id"],
      response["userId"],
      response["email"],
      response["balance"],
      response["isShopkeeper"],
      new Password(response["password"], String(process.env.SALT))
    );
  }

  async findByUserId(userId: string): Promise<Account | null> {
    let response = undefined;

    this.accountDatabase.forEach((account) => {
      if (account.userId === userId) {
        response = account;
      }
    });

    if (!response) return null;

    return new Account(
      response["id"],
      response["userId"],
      response["email"],
      response["balance"],
      response["isShopkeeper"],
      new Password(response["password"], String(process.env.SALT))
    );
  }

  async save(account: Account): Promise<void> {
    this.accountDatabase.set(account.id, {
      id: account.id,
      email: account.email,
      balance: account.getBalance(),
      password: account.password.value,
      isShopkeeper: account.isShopkeeper,
      userId: account.userId,
    });
  }

  async update(account: Account): Promise<void> {
    const accountDb = this.accountDatabase.get(account.id);

    if (!accountDb) return;

    accountDb.balance = account.getBalance();
  }
}
