import { BaseEntity } from 'shared/domain/entities/base-entity';

export class CategoryEntity extends BaseEntity {
  public userId: string;
  public name: string;
  public color: string;
}
