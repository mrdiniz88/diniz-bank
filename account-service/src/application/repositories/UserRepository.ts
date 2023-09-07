import User from "../../domain/entities/User";

export default interface UserRepository {
  findByDocument(document: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
