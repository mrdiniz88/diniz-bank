import { randomUUID } from "crypto";

export default class Transaction {
  constructor(
    readonly id: string,
    readonly senderId: string,
    readonly receiverId: string,
    readonly amount: number
  ) {}

  static create(senderId: string, receiverId: string, amount: number) {
    return new Transaction(randomUUID(), senderId, receiverId, amount);
  }
}
