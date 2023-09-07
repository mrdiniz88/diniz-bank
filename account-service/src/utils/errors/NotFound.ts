import { BaseError } from "./BaseError";

export default class NotFound extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}
