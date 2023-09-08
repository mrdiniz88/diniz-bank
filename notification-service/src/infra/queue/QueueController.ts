import SendEmail from "../../application/usecases/SendEmail";
import FakeNotificationGateway from "../gateways/FakeNotificationGateway";
import Queue from "./Queue";
import RabbitMQAdapter from "./RabbitMQAdapter";

export default class QueueController {
  constructor(queue: Queue, sendEmail: SendEmail) {
    queue.on("SendEmail", async (event: any) => {
      await sendEmail.execute({
        email: event.email,
        body: event.body,
      });
    });
  }
}

(async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.assertExchange("SendNotification", "direct");
  await queue.assertQueue("SendEmail", {
    durable: true,
    messageTtl: 60000
  });
  await queue.bindQueue("SendEmail", "SendNotification", "Email");

  const notificationGateway = new FakeNotificationGateway();
  const sendEmail = new SendEmail(notificationGateway);

  new QueueController(queue, sendEmail);

  console.log("Consumer is running");
})();
