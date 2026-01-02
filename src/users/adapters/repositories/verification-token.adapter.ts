import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import {
  VerificationTokenEntity,
  VerificationTokenType,
} from '@users/domain/entities/verification-token.entity';
import { IVerificationTokenRepositoryPort } from '@users/domain/repositories/verification-token.repository.port';

import { PrismaClientSingleton } from '../../../prisma-client';

@injectable()
export class VerificationTokenRepositoryAdapter
  extends BaseRepository<VerificationTokenEntity>
  implements IVerificationTokenRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = PrismaClientSingleton.getInstance();

    super(prisma.verificationToken);
    this.prisma = prisma;
  }

  async findByUserId(
    userId: string,
    type: VerificationTokenType,
  ): Promise<VerificationTokenEntity | null> {
    const token = await this.prisma.verificationToken.findFirst({
      where: {
        userId,
        type,
        deletedAt: null,
      },
    });

    if (!token) {
      return null;
    }

    return {
      ...token,
      type: token.type as VerificationTokenType,
    };
  }

  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token,
        isUsed: false,
        deletedAt: null,
      },
    });

    if (!verificationToken) {
      return null;
    }

    return {
      ...verificationToken,
      type: verificationToken.type as VerificationTokenType,
    };
  }

  async updateUsedStatus(tokenId: string): Promise<void> {
    await this.prisma.verificationToken.update({
      where: {
        id: tokenId,
      },
      data: {
        isUsed: true,
        deletedAt: new Date(),
      },
    });
  }
}
