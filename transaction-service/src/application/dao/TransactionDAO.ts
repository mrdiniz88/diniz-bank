export type Filters = {
  accountId?: string;
};

export default interface TransactionDAO {
  findMany(filters?: Filters): Promise<any[]>;
}
