import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import {
  TransactionEntity,
  TransactionMethod,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';
import {
  FindByDateParams,
  ITransactionRepositoryPort,
} from '@transactions/domain/repositories/transaction.repository.port';
import { TransactionsByMethod } from '@transactions/domain/types/transactions-by-method';

@injectable()
export class TransactionRepositoryAdapter
  extends BaseRepository<TransactionEntity>
  implements ITransactionRepositoryPort
{
  private readonly prisma: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();

    super(prisma.transaction);
    this.prisma = prisma;
  }

  async findByExternalIdAndUserId(
    externalId: string,
    userId: string,
  ): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        externalId,
        userId,
        deletedAt: null,
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

  async findByDate(params: FindByDateParams): Promise<TransactionEntity[]> {
    const { userId, month, year } = params;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        category: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    return transactions.map(transaction => ({
      ...transaction,
      type: transaction.type as TransactionType,
      method: transaction.method as TransactionMethod,
      category: transaction.category,
    }));
  }

  async deleteCategoryId(categoryId: string): Promise<void> {
    await this.prisma.transaction.updateMany({
      where: {
        categoryId,
        deletedAt: null,
      },
      data: {
        categoryId: null,
      },
    });
  }

  async listByPaymentMethod(params: FindByDateParams): Promise<TransactionsByMethod[]> {
    const { userId, month, year } = params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await this.prisma.$queryRaw<TransactionsByMethod[]>`
      SELECT method, SUM(amount) as total
      FROM transactions
      WHERE "user_id" = ${userId}::uuid
        AND "deleted_at" IS NULL
        AND "date" >= ${startDate}
        AND "date" < ${endDate}
        AND "type" = ${TransactionType.CASH_OUT}
        AND "description" != 'Aplicação RDB'
      GROUP BY method
    `;

    return transactions.map(transaction => ({
      method: transaction.method as TransactionMethod,
      total: transaction.total,
    }));
  }
}
