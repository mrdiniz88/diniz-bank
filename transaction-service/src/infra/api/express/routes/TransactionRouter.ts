import { Router } from "express";
import ListTransactionsByAccountId from "../../../../application/usecases/ListTransactionsByAccountId";
import { transactionDAO } from "../app";

const transactionRouter = Router();

transactionRouter.get("/:accountId", async (req, res, next) => {
  const listTransactionsByAccountId = new ListTransactionsByAccountId(
    transactionDAO
  );

  try {
    const output = await listTransactionsByAccountId.execute({
      accountId: req.params.accountId,
    });

    res.status(200).json(output);
  } catch (err) {
    next(err);
  }
});

export default transactionRouter;
