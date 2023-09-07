import Queue from "../../../src/infra/queue/Queue";

const QueueMock: Queue = {
  connect: jest.fn(),
  on: jest.fn(),
  publish: jest.fn(),
};

export default QueueMock;
