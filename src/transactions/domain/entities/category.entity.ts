import { BaseEntity } from '@shared/domain/entities/base-entity';

import { TransactionType } from './transaction.entity';

export class CategoryEntity extends BaseEntity {
  userId: string;
  name: string;
  color: string;
  type: TransactionType | null;
}
