import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { SubscriptionEntity } from '../entities/subscription.entity';

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ISubscriptionRepositoryPort extends IBaseRepository<SubscriptionEntity> {}
