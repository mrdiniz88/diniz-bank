import Transaction from "../../domain/entities/Transaction";

export default interface TransactionRepositry {
  save(transaction: Transaction): Promise<void>;
}
