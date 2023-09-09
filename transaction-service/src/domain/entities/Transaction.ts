import { randomUUID } from "crypto";
import AccountHolder from "./AccountHolder";

type Status = "PROCESSING" | "APPROVED" | "DENIED" | "ERROR";

export default class Transaction {
  constructor(
    readonly id: string,
    readonly sender: AccountHolder,
    readonly receiver: AccountHolder,
    readonly amount: number,
    private status: Status,
    readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(
    sender: AccountHolder,
    receiver: AccountHolder,
    amount: number
  ) {
    const currentDate = new Date();
    return new Transaction(
      randomUUID(),
      sender,
      receiver,
      amount,
      "PROCESSING",
      currentDate,
      currentDate
    );
  }

  denied() {
    this.status = "DENIED";
    this.updatedAt = new Date();
  }

  approved() {
    this.status = "APPROVED";
    this.updatedAt = new Date();
  }

  error() {
    this.status = "ERROR";
    this.updatedAt = new Date();
  }

  getStatus(): Status {
    return this.status;
  }

  getLastUpdate(): Date {
    return this.updatedAt;
  }
}
