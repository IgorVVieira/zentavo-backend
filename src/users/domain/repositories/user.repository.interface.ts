import { User } from 'users/domain/entities/user';

import { IBaseRepository } from 'shared/domain/repositories/base.repository.interface';

export interface IUserRepositoryPort extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
