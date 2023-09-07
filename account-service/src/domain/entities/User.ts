import { randomUUID } from "crypto";
import Document from "../value-objects/Document";
import Password from "../value-objects/Password";

export default class User {
  constructor(
    readonly id: string,
    readonly fullName: string,
    readonly document: Document
  ) {}

  static create(fullName: string, document: Document) {
    return new User(randomUUID(), fullName, document);
  }
}
