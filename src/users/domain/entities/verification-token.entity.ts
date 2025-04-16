import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum VerificationTokenType {
  ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export class VerificationTokenEntity extends BaseEntity {
  userId: string;
  token: string;
  expirationDate: Date;
  type: VerificationTokenType;
  isUsed: boolean;
}
