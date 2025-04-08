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

  public async findByDate(
    userId: string,
    month: number,
    year: number,
  ): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        category: true,
      },
    });

    return transactions.map(transaction => ({
      ...transaction,
      type: transaction.type as TransactionType,
      method: transaction.method as TransactionMethod,
      category: transaction.category,
    }));
  }
}
