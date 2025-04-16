import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import { User, UserStatus } from '@users/domain/entities/user.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';

@injectable()
export class UserRepositoryAdapter extends BaseRepository<User> implements IUserRepositoryPort {
  private readonly prisma: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();

    super(prisma.user);
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      status: user.status as UserStatus,
    };
  }
}
