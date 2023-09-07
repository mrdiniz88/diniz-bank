import { PrismaClient } from "@prisma/client";
import AccountRepository from "../../../../application/repositories/AccountRepository";
import Account from "../../../../domain/entities/Account";
import Password from "../../../../domain/value-objects/Password";

export default class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prismaClient.account.findUnique({
      where: { email },
    });

    if (!account) return null;

    return new Account(
      account.id,
      account.userId,
      account.email,
      account.balance,
      account.isShopkeeper,
      new Password(account.password, String(process.env.SALT))
    );
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prismaClient.account.findUnique({
      where: { id },
    });

    if (!account) return null;

    return new Account(
      account.id,
      account.userId,
      account.email,
      account.balance,
      account.isShopkeeper,
      new Password(account.password, String(process.env.SALT))
    );
  }

  async update(account: Account): Promise<void> {
    await this.prismaClient.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: account.getBalance(),
      },
    });
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const account = await this.prismaClient.account.findUnique({
      where: { userId },
    });

    if (!account) return null;

    return new Account(
      account.id,
      account.userId,
      account.email,
      account.balance,
      account.isShopkeeper,
      new Password(account.password, String(process.env.SALT))
    );
  }

  async save(account: Account): Promise<void> {
    await this.prismaClient.account.create({
      data: {
        id: account.id,
        email: account.email,
        password: account.password.value,
        isShopkeeper: account.isShopkeeper,
        balance: account.getBalance(),
        userId: account.userId,
      },
    });
  }
}
