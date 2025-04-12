import { BaseEntity } from 'shared/domain/entities/base-entity';

export class User extends BaseEntity {
  name: string;
  email: string;
  password: string;
}
