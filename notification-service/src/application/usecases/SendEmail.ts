import NotificationGateway from "../gateways/NotificatonGateway";

type Input = {
  email: string;
  body: string;
};

export default class SendEmail {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async execute(input: Input) {
    await this.notificationGateway.sendEmail(input.email, input.body);
  }
}
