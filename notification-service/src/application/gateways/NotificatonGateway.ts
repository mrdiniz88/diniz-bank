export default interface NotificationGateway {
  sendEmail(email: string, body: string, attempt?: number): Promise<void>;
}
