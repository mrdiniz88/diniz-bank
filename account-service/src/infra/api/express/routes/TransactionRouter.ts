import { Router } from "express";
import DoTransaction from "../../../../application/usecases/DoTransaction";
import InputMoney from "../../../../application/usecases/InputMoney";
import { accountRepository, userRepository } from "../app";
import { queue } from "../queues/AssertQueues";

export const transactionRouter = Router();

transactionRouter.post("/", async (req, res, next) => {
  const { amount, receiverId, senderId } = req.body;

  const doTransaction = new DoTransaction(
    accountRepository,
    userRepository,
    queue
  );

  try {
    await doTransaction.execute({
      amount,
      receiverId,
      senderId,
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

transactionRouter.post("/:id", async (req, res, next) => {
  const { amount } = req.body;
  const id = req.params.id;

  const inputMoney = new InputMoney(accountRepository);

  try {
    await inputMoney.execute({
      amount,
      id,
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});
