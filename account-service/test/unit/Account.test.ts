import Account from "../../src/domain/entities/Account";
import Password from "../../src/domain/value-objects/Password";

describe("Account tests", () => {
  it("should create a account", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      true,
      Password.create("12345678", "salt")
    );

    expect(account.id).toBeDefined();
    expect(account.getBalance()).toBe(0);
  });

  it("should credit amount in account", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      true,
      Password.create("12345678", "salt")
    );

    account.credit(10);

    expect(account.getBalance()).toBe(10);
  });

  it("should debit amount if is not shopkeeper", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      false,
      Password.create("12345678", "salt")
    );

    account.credit(10);
    account.debit(2);

    expect(account.getBalance()).toBe(8);
  });

  it("should not debit if amount is greater than the balance", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      false,
      Password.create("12345678", "salt")
    );

    expect(() => account.debit(2)).toThrowError("You do not have this value");
  });

  it("should not debit amount if is shopkeeper", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      true,
      Password.create("12345678", "salt")
    );

    account.credit(10);

    expect(() => account.debit(2)).toThrowError("Shopkeeper cannot send money");
  });

  it("should not debit or credit if amount is less or equal than zero", () => {
    const account = Account.create(
      "1",
      "john.doe@gmail.com",
      false,
      Password.create("12345678", "salt")
    );

    expect(() => account.credit(-2)).toThrowError("Invalid amount");
    expect(() => account.credit(0)).toThrowError("Invalid amount");

    expect(() => account.debit(-2)).toThrowError("Invalid amount");
    expect(() => account.debit(0)).toThrowError("Invalid amount");
  });
});
