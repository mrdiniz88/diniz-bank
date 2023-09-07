import { randomUUID } from "crypto";
import BadRequest from "../../utils/errors/BadRequest";
import Password from "../value-objects/Password";

export default class Account {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly email: string,
    private balance: number,
    readonly isShopkeeper: boolean,
    readonly password: Password
  ) {}

  static create(
    userId: string,
    email: string,
    isShopkeeper: boolean,
    password: Password
  ) {
    return new Account(randomUUID(), userId, email, 0, isShopkeeper, password);
  }

  validatePassword(password: string) {
    return this.password.validate(password);
  }

  debit(amount: number) {
    if (amount <= 0) throw new BadRequest("Invalid amount");
    if (this.isShopkeeper) throw new BadRequest("Shopkeeper cannot send money");
    if (this.balance < amount)
      throw new BadRequest("You do not have this value");

    this.balance -= amount;
  }

  credit(amount: number) {
    if (amount <= 0) throw new BadRequest("Invalid amount");

    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}
