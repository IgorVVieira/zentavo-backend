import { IBaseRepository } from "shared/domain/repositories/base.repository.interface";
import { User } from "users/domain/entities/user";

export interface IUserRepositoryPort extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
