import Queue from "./Queue";
import amqp from "amqplib";

type ExchangeTypes = "fanout" | "direct" | "topic";

export default class RabbitMQAdapter implements Queue {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.AMQP_URL!);

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }
  }

  async assertExchange(name: string, type: ExchangeTypes) {
    await this.channel.assertExchange(name, type, {
      durable: true,
    });
  }

  async assertQueue(queueName: string, options?: amqp.Options.AssertQueue) {
    await this.channel.assertQueue(queueName, options);
  }

  async bindQueue(queueName: string, exchangeName: string, routingKey: string) {
    await this.channel.bindQueue(queueName, exchangeName, routingKey);
  }

  async on(queueName: string, callback: Function): Promise<void> {
    const channel = this.channel;
    await channel.consume(queueName, async function (msg) {
      if (!msg) throw new Error("Invalid message");

      const input = JSON.parse(msg.content.toString());
      try {
        await callback(input);
        channel.ack(msg);
      } catch (err) {
        const maxRetries = 3;
        const retryCount = msg.properties.headers["x-retry-count"] || 0;

        if (retryCount < maxRetries) {
          channel.ack(msg);
          const delayMilliseconds = 1000 * Math.pow(2, retryCount);
          await new Promise((resolve) =>
            setTimeout(resolve, delayMilliseconds)
          );

          const updatedHeaders = {
            ...msg.properties.headers,
            "x-retry-count": retryCount + 1,
          };

          channel.sendToQueue(queueName, msg.content, {
            headers: updatedHeaders,
          });
          console.log(
            `Mensagem ${msg.content.toString()} reenviada após ${
              retryCount + 1
            }ª tentativa`
          );
        } else {
          channel.nack(msg, false, false);
          console.log(
            `Mensagem ${msg.content.toString()} descartada devido a muitas retentativas`
          );
        }
      }
    });
  }

  async publish(name: string, data: any): Promise<void> {
    this.channel.publish(
      name,
      data?.routingKey ?? "",
      Buffer.from(JSON.stringify(data.payload))
    );
  }
}
