import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import {
  VerificationTokenEntity,
  VerificationTokenType,
} from '@users/domain/entities/verification-token.entity';

export interface IVerificationTokenRepositoryPort extends IBaseRepository<VerificationTokenEntity> {
  findByUserId(
    userId: string,
    type: VerificationTokenType,
  ): Promise<VerificationTokenEntity | null>;

  findByToken(token: string): Promise<VerificationTokenEntity | null>;

  updateUsedStatus(tokenId: string, isUsed: boolean): Promise<void>;
}
