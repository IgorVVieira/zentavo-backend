import { injectable } from 'tsyringe';

import { EntityName } from '@shared/domain/entities/entity-name.enum';
import { BaseRepository } from '@shared/repositories/base.repository';

import { User } from '@users/core/domain/entities/user';
import { IUserRepositoryPort } from '@users/core/domain/repositories/user.repository.port';

@injectable()
export class UserRepositoryAdapter extends BaseRepository<User> implements IUserRepositoryPort {
  public constructor() {
    super(EntityName.users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
