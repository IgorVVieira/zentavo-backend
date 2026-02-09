import { BaseRepository } from '@shared/repositories/base.repository';

import { SubscriptionEntity } from '@payments/domain/entities/subscription.entity';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';
import { PrismaClientSingleton } from 'prisma-client';

export class SubscriptionReposotoryAdapter
  extends BaseRepository<SubscriptionEntity>
  implements ISubscriptionRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = PrismaClientSingleton.getInstance();

    super(prisma.subscription);
    this.prisma = prisma;
  }
}
