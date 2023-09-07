import { PrismaClient } from "@prisma/client";
import UserRepository from "../../../../application/repositories/UserRepository";
import User from "../../../../domain/entities/User";
import Document from "../../../../domain/value-objects/Document";

export default class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(user.id, user.fullName, new Document(user.document));
  }

  async findByDocument(document: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { document },
    });

    if (!user) return null;

    return new User(user.id, user.fullName, new Document(user.document));
  }

  async save(user: User): Promise<void> {
    await this.prismaClient.user.create({
      data: {
        id: user.id,
        document: user.document.value,
        fullName: user.fullName,
      },
    });
  }
}
