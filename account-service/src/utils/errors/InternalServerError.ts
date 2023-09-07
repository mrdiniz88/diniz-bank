import { BaseError } from "./BaseError";

export default class InternalServerError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}
