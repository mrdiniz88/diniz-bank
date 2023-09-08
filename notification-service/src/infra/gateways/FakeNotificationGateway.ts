import NotificationGateway from "../../application/gateways/NotificatonGateway";
import axios from "axios";

export default class FakeNotificationGateway implements NotificationGateway {
  async sendEmail(email: string, body: string): Promise<void> {
    await axios.post(
      "http://o4d9z.mocklab.io/notify",
      {
        email,
        body,
      },
      {
        timeout: 10000,
      }
    );
  }
}
