import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { SubscriptionEntity } from '../entities/subscription.entity';

export interface ISubscriptionRepositoryPort extends IBaseRepository<SubscriptionEntity> {
  hasSubscriptionActive(userId: string): Promise<boolean>;
}
