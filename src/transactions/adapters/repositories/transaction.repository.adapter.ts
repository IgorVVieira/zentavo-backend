import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import {
  TransactionEntity,
  TransactionMethod,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';

@injectable()
export class TransactionRepositoryAdapter
  extends BaseRepository<TransactionEntity>
  implements ITransactionRepositoryPort
{
  private readonly prisma: PrismaClient;

  public constructor() {
    const prisma = new PrismaClient();

    super(prisma.transaction);
    this.prisma = prisma;
  }

  public async findByExternalIdAndUserId(
    externalId: string,
    userId: string,
  ): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        externalId,
        userId,
      },
    });

    if (!transaction) {
      return null;
    }

    return {
      ...transaction,
      type: transaction.type as TransactionType,
      method: transaction.method as TransactionMethod,
    };
  }
}
