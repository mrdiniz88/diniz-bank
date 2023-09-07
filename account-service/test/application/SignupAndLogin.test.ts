import dotenv from "dotenv";
import InMemoryAccountDatabase from "../infra/database/InMemoryAccountRepository";
import InMemoryUserDatabase from "../infra/database/InMemoryUserRepository";
import Signup from "../../src/application/usecases/Signup";
import Login from "../../src/application/usecases/Login";

dotenv.config();

test("should signup and login", async function () {
  const userRepository = new InMemoryUserDatabase();
  const accountRepository = new InMemoryAccountDatabase();
  const signup = new Signup(userRepository, accountRepository);
  const inputSignup = {
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    document: "49.924.610/0001-70",
    isShopkeeper: true,
    password: "12345678",
  };
  await signup.execute(inputSignup);
  const login = new Login(userRepository, accountRepository);
  const inputLogin = {
    email: "john.doe@gmail.com",
    password: "12345678",
  };
  const output = await login.execute(inputLogin);

  expect(output.account.id).toBeDefined();
  expect(output.account.isShopkeeper).toEqual(true);
  expect(output.account.balance).toEqual(0);
  expect(output.account.email).toEqual("john.doe@gmail.com");
  expect(output.account.user).toStrictEqual({
    document: "49.924.610/0001-70",
    fullName: "John Doe",
  });
});
