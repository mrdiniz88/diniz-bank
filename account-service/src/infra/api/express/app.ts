import { PrismaClient } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import express, { NextFunction, Request, Response } from "express";
import { BaseError } from "../../../utils/errors/BaseError";
import PrismaAccountRepository from "../../database/prisma/repository/PrismaAccountRepository";
import PrismaUserRepository from "../../database/prisma/repository/PrismaUserRepository";
import { transactionRouter } from "./routes/TransactionRouter";
import { userRouter } from "./routes/UserRouter";

export const app = express();

app.use(express.json());

export const prismaClient = new PrismaClient();
export const userRepository = new PrismaUserRepository(prismaClient);
export const accountRepository = new PrismaAccountRepository(prismaClient);

app.use(userRouter);
app.use("/transaction", transactionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    let response = {};
    try {
      response = { errors: JSON.parse(err.message) };
    } catch (error) {
      response = { error: err.message };
    }
    return res.status(err.statusCode).send(response);
  }

  console.error("Internal server error ===>\n", err.message);

  if (err instanceof PrismaClientValidationError) {
    return res.status(500).send();
  }

  next(err);
});
