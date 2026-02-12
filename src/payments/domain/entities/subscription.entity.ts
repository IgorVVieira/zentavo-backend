import { BaseEntity } from '@shared/domain/entities/base-entity';

import { User } from '@users/domain/entities/user.entity';

import { ProductEntity } from './product.entity';

export enum SubscriptionStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
}

export class SubscriptionEntity extends BaseEntity {
  userId: string;
  productId: string;
  paymentId: string;
  startAt: Date | string;
  endAt: Date | string;
  price: number; // In cents
  status: SubscriptionStatus = SubscriptionStatus.PENDING_PAYMENT;

  user?: User;
  product?: ProductEntity;
}
