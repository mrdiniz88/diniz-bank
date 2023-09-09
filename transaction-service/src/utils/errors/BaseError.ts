export abstract class BaseError extends Error {
  constructor(message: string | string[], readonly statusCode: number) {
    super(typeof message === "string" ? message : JSON.stringify(message));
  }
}
