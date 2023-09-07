import { pbkdf2Sync } from "crypto";
import BadRequest from "../../utils/errors/BadRequest";

export default class Password {
  constructor(readonly value: string, readonly salt: string) {}

  static create(value: string, salt: string) {
    if (value.length < 8) throw new BadRequest("Invalid password");

    const passwordEncrypted = pbkdf2Sync(value, salt, 100, 64, "sha512");

    return new Password(passwordEncrypted.toString("hex"), salt);
  }

  validate(plainPassword: string) {
    const password = pbkdf2Sync(plainPassword, this.salt, 100, 64, "sha512");
    return this.value === password.toString("hex");
  }
}
