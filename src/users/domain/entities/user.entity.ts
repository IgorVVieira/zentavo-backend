import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PEDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED',
}

type UserParams = {
  id?: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  status: UserStatus;

  constructor(userParams: UserParams) {
    const { id, name, email, password, status } = userParams;

    super();

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = status;
    this.createdAt = userParams.createdAt ?? new Date();
    this.updatedAt = userParams.updatedAt ?? new Date();
  }

  isActive?(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
