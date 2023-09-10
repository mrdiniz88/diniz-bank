import dotenv from "dotenv";
import InMemoryAccountDatabase from "../infra/database/InMemoryAccountRepository";
import InMemoryUserDatabase from "../infra/database/InMemoryUserRepository";
import Signup from "../../src/application/usecases/Signup";
import Login from "../../src/application/usecases/Login";
import InputMoney from "../../src/application/usecases/InputMoney";
import DoTransaction from "../../src/application/usecases/DoTransaction";
import TransactionApproved from "../../src/application/usecases/TransactionApproved";
import queueMock from "../infra/queue/QueueMock";
import TransactionDenied from "../../src/application/usecases/TransactionDenied";

dotenv.config();

describe("do transaction", function () {
  let login: Login;
  let inputModey: InputMoney;
  let doTransaction: DoTransaction;
  let transactionApproved: TransactionApproved;
  let transactionDenied: TransactionDenied;
  let sender: any;
  let receiver: any;

  beforeEach(async () => {
    const userRepository = new InMemoryUserDatabase();
    const accountRepository = new InMemoryAccountDatabase();
    const signup = new Signup(userRepository, accountRepository);
    queueMock.connect();
    login = new Login(userRepository, accountRepository);
    inputModey = new InputMoney(accountRepository);
    doTransaction = new DoTransaction(
      accountRepository,
      userRepository,
      queueMock
    );
    transactionApproved = new TransactionApproved(
      accountRepository,
      userRepository,
      queueMock
    );
    transactionDenied = new TransactionDenied(accountRepository);

    queueMock.connect();

    await signup.execute({
      fullName: "John Doe",
      email: "john.doe@gmail.com",
      document: "49.924.610/0001-70",
      isShopkeeper: true,
      password: "12345678",
    });
    await signup.execute({
      fullName: "Jane Doe",
      email: "jane.doe@gmail.com",
      document: "453.181.430-40",
      isShopkeeper: false,
      password: "12345678",
    });

    const senderLogin = await login.execute({
      email: "jane.doe@gmail.com",
      password: "12345678",
    });

    const receiverLogin = await login.execute({
      email: "john.doe@gmail.com",
      password: "12345678",
    });

    await inputModey.execute({
      id: senderLogin.account.id,
      amount: 20,
    });

    await doTransaction.execute({
      senderId: senderLogin.account.id,
      receiverId: receiverLogin.account.id,
      amount: 10,
    });

    sender = await login.execute({
      email: "jane.doe@gmail.com",
      password: "12345678",
    });

    receiver = await login.execute({
      email: "john.doe@gmail.com",
      password: "12345678",
    });
  });

  it("transaction sent", async () => {
    expect(sender.account.balance).toBe(10);
    expect(receiver.account.balance).toBe(0);
  });

  it("transaction approved", async () => {
    await transactionApproved.execute({
      receiverId: receiver.account.id,
      amount: 10,
      senderId: sender.account.id,
    });

    const senderAfterTransactionApproved = await login.execute({
      email: "jane.doe@gmail.com",
      password: "12345678",
    });

    const receiverAfterTransactionApproved = await login.execute({
      email: "john.doe@gmail.com",
      password: "12345678",
    });

    expect(senderAfterTransactionApproved.account.balance).toBe(10);
    expect(receiverAfterTransactionApproved.account.balance).toBe(10);
  });

  it("transaction denied", async () => {
    await transactionDenied.execute({
      senderId: sender.account.id,
      amount: 10,
    });
    const senderAfterTransactionDenied = await login.execute({
      email: "jane.doe@gmail.com",
      password: "12345678",
    });

    const receiverAfterTransactionDenied = await login.execute({
      email: "john.doe@gmail.com",
      password: "12345678",
    });

    expect(senderAfterTransactionDenied.account.balance).toBe(20);
    expect(receiverAfterTransactionDenied.account.balance).toBe(0);
  });
});
