import { Router } from "express";
import DoTransaction from "../../../../application/usecases/DoTransaction";
import InputMoney from "../../../../application/usecases/InputMoney";
import { accountRepository } from "../app";
import { queue } from "../queues/AssertQueues";

export const transactionRouter = Router();

transactionRouter.post("/", async (req, res, next) => {
  const { amount, receiverId, senderId } = req.body;

  const approveTransaction = new DoTransaction(accountRepository, queue);

  try {
    await approveTransaction.execute({
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

  const approveTransaction = new InputMoney(accountRepository);

  try {
    await approveTransaction.execute({
      amount,
      id,
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});
