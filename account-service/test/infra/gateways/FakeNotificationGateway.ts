import NotificationGateway from "../../../src/application/gateways/NotificatonGateway";

export default class FakeNotificationGateway implements NotificationGateway {
  async sendEmail(email: string, body: string): Promise<void> {
    return;
  }
}
