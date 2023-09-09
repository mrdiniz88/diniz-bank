import { Router } from "express";
import Login from "../../../../application/usecases/Login";
import Signup from "../../../../application/usecases/Signup";
import { userRepository, accountRepository } from "../app";

export const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  const { document, email, fullName, isShopkeeper, password } = req.body;

  const signup = new Signup(userRepository, accountRepository);

  try {
    await signup.execute({
      document,
      email,
      fullName,
      isShopkeeper,
      password,
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const signup = new Login(userRepository, accountRepository);

  try {
    const response = await signup.execute({
      email,
      password,
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", (req, res) => {
  res.status(400).send();
});
