import { BaseEntity } from '@shared/domain/entities/base-entity';

export class CategoryEntity extends BaseEntity {
  userId: string;
  name: string;
  color: string;
}
