import { BaseError } from "./BaseError";

export default class BadRequest extends BaseError {
  constructor(message: string | string[]) {
    super(message, 400);
  }
}
