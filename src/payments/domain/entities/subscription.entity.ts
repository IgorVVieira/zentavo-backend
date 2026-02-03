import { BaseEntity } from '@shared/domain/entities/base-entity';

import { ProductEntity } from './product.entity';

export class SubscriptionEntity extends BaseEntity {
  userId: string;
  productId: string;
  startAt: Date | string;
  endAt: Date | string;
  price: number; // In cents

  product: ProductEntity;
}
