export default interface Queue {
  connect(): Promise<void>;
  on(queueName: string, callback: Function): Promise<void>;
  publish(name: string, data: any): Promise<void>;
}
