import { BaseEntity } from '@shared/domain/entities/base-entity';

export class ProductEntity extends BaseEntity {
  name: string;
  description: string;
  price: number; // In cents
  features: Record<string, boolean>;
  durationInDays: number;
}
