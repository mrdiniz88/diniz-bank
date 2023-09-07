import UserRepository from "../../../src/application/repositories/UserRepository";
import User from "../../../src/domain/entities/User";
import Document from "../../../src/domain/value-objects/Document";

export default class InMemoryUserDatabase implements UserRepository {
  private userDatabase = new Map<string, { [key: string]: any }>();

  async findById(id: string): Promise<User | null> {
    const user = this.userDatabase.get(id);

    if (!user) return null;

    return new User(
      user["id"],
      user["fullName"],
      new Document(user["document"])
    );
  }

  async findByDocument(document: string): Promise<User | null> {
    let response = undefined;

    this.userDatabase.forEach((user) => {
      if (user.document === document) response = user;
    });

    if (!response) return null;

    return new User(
      response["id"],
      response["fullName"],
      new Document(response["document"])
    );
  }

  async save(user: User): Promise<void> {
    this.userDatabase.set(user.id, {
      id: user.id,
      document: user.document.value,
      fullName: user.fullName,
    });
  }
}
