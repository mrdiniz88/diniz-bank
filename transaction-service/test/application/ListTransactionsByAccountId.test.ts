import axios from "axios";
import ApproveTransaction from "../../src/application/usecases/ApproveTransaction";
import ListTransactionsByAccountId from "../../src/application/usecases/ListTransactionsByAccountId";
import InMemoryTransactionDAO from "../infra/database/dao/InMemoryTransactionDAO";
import InMemoryTransactionRepository from "../infra/database/repository/InMemoryTransactionRepository";
import QueueMock from "../infra/queue/QueueMock";

describe("ListTransactionsByAccountId", () => {
  let listTransactionsByAccountId: ListTransactionsByAccountId;
  let transactionDatabase: any[];
  let axiosPostSpy: jest.SpyInstance;

  beforeEach(async () => {
    axiosPostSpy = jest.spyOn(axios, "post");

    axiosPostSpy.mockResolvedValue({
      statusCode: 200,
      data: {
        message: "Autorizado",
      },
    });

    transactionDatabase = [];
    const transactionRepository = new InMemoryTransactionRepository(
      transactionDatabase
    );

    const approveTransaction = new ApproveTransaction(
      transactionRepository,
      QueueMock
    );

    await approveTransaction.execute({
      amount: 5,
      receiverId: "1",
      receiverName: "June",
      senderId: "2",
      senderName: "John",
    });

    const transactionDAO = new InMemoryTransactionDAO(transactionDatabase);

    listTransactionsByAccountId = new ListTransactionsByAccountId(
      transactionDAO
    );
  });

  it("should list June transactions", async () => {
    const result = await listTransactionsByAccountId.execute({
      accountId: "1",
    });

    expect(result.transactions[0].id).toBeDefined();
    expect(result.transactions[0].peerName).toBe("John");
    expect(result.transactions[0].amount).toBe(5);
    expect(result.transactions[0].action).toBe("RECEIVED");
    expect(result.transactions[0].createdAt).toBeDefined();
  });

  it("should list John transactions", async () => {
    const result = await listTransactionsByAccountId.execute({
      accountId: "2",
    });

    expect(result.transactions[0].id).toBeDefined();
    expect(result.transactions[0].peerName).toBe("June");
    expect(result.transactions[0].amount).toBe(5);
    expect(result.transactions[0].action).toBe("SENT");
    expect(result.transactions[0].createdAt).toBeDefined();
  });
});
