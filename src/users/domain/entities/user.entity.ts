import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PEDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED',
}

export class User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  externalCustomerId?: string | null;

  static isActive(user: User): boolean {
    return user.status === UserStatus.ACTIVE;
  }
}
