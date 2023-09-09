import axios, { AxiosError } from "axios";
import ApproveTransaction from "../../src/application/usecases/ApproveTransaction";
import InMemoryTransactionRepository from "../infra/database/repository/InMemoryTransactionRepository";
import QueueMock from "../infra/queue/QueueMock";

describe("ApproveTransaction", () => {
  let approveTransaction: ApproveTransaction;
  let axiosPostSpy: jest.SpyInstance;
  let transactionDatabase: any[];

  beforeEach(async () => {
    axiosPostSpy = jest.spyOn(axios, "post");

    transactionDatabase = [];
    const transactionRepository = new InMemoryTransactionRepository(
      transactionDatabase
    );
    approveTransaction = new ApproveTransaction(
      transactionRepository,
      QueueMock
    );
  });

  it("should be approved", async () => {
    axiosPostSpy.mockResolvedValue({
      statusCode: 200,
      data: {
        message: "Autorizado",
      },
    });

    await approveTransaction.execute({
      amount: 5,
      receiverId: "1",
      receiverName: "June",
      senderId: "2",
      senderName: "John",
    });

    const { id, status } = transactionDatabase.find(
      (transaction) => transaction.senderId === "2"
    );

    expect(id).toBeDefined();
    expect(status).toBe("APPROVED");
  });

  it("should be denied", async () => {
    axiosPostSpy.mockRejectedValue(
      new AxiosError(undefined, undefined, undefined, undefined, {
        status: 400,
        data: {
          message: "Não autorizado",
        },
        config: undefined!,
        headers: undefined!,
        statusText: "Bad Request",
      })
    );

    await approveTransaction.execute({
      amount: 5,
      receiverId: "1",
      receiverName: "June",
      senderId: "2",
      senderName: "John",
    });

    const { id, status } = transactionDatabase.find(
      (transaction) => transaction.senderId === "2"
    );

    expect(id).toBeDefined();
    expect(status).toBe("DENIED");
  });

  it("should be error", async () => {
    axiosPostSpy.mockRejectedValue(
      new AxiosError(undefined, undefined, undefined, undefined, {
        status: 500,
        data: {},
        config: undefined!,
        headers: undefined!,
        statusText: "Internal Server Error",
      })
    );

    await expect(
      async () =>
        await approveTransaction.execute({
          amount: 5,
          receiverId: "1",
          receiverName: "June",
          senderId: "2",
          senderName: "John",
        })
    ).rejects.toThrow();

    const { id, status } = transactionDatabase.find(
      (transaction) => transaction.senderId === "2"
    );

    expect(id).toBeDefined();
    expect(status).toBe("ERROR");
  });
});
