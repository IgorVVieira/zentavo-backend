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
import {
  TransactionsByCategory,
  TransactionsByMethod,
  TransactionsLastSixMonths,
} from '@transactions/domain/types/dashboard.type';

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
      GROUP BY method
    `;

    return transactions.map(transaction => ({
      method: transaction.method as TransactionMethod,
      total: transaction.total,
    }));
  }

  async listByCategory(params: FindByDateParams): Promise<TransactionsByCategory[]> {
    const { userId, month, year, transactionType } = params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await this.prisma.$queryRaw<TransactionsByCategory[]>`
      WITH totals AS (
        SELECT
          COALESCE(c.id::text, 'uncatecorized') AS id,
          COALESCE(c.name, 'Outros') AS name,
          c.color,
          SUM(t.amount) AS total
        FROM transactions t
        LEFT JOIN categories c
          ON t.category_id = c.id
          AND c.deleted_at IS NULL
        WHERE t.user_id = ${userId}::uuid
          AND t.deleted_at IS NULL
          AND t.type = ${transactionType}
          AND t.date >= ${startDate}
          AND t.date < ${endDate}
        GROUP BY c.id, c.name, c.color
      )
      SELECT
        id,
        name,
        color,
        ROUND(total::numeric, 2) AS total,
        ROUND((total * 100.0 / SUM(total) OVER ())::numeric, 2) AS percentage
      FROM totals
      ORDER BY total DESC;
    `;

    return result.map(item => ({
      id: item.id,
      name: item.name,
      color: item.color,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      total: (item.total as any)?.toNumber?.() ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      percentage: (item.percentage as any)?.toNumber?.() ?? 0,
    }));
  }

  async listByLastSixMonths(userId: string): Promise<TransactionsLastSixMonths[]> {
    return this.prisma.$queryRaw<TransactionsLastSixMonths[]>`
      SELECT
        EXTRACT(MONTH FROM t.date)::int AS month,
        EXTRACT(YEAR FROM t.date)::int AS year,
        SUM(CASE WHEN t.type = 'CASH_IN' THEN t.amount ELSE 0 END)::float AS "totalCashIn",
        SUM(CASE WHEN t.type = 'CASH_OUT' THEN t.amount ELSE 0 END)::float AS "totalCashOut"
      FROM transactions t
      WHERE t.user_id = ${userId}::uuid
        AND t.deleted_at IS NULL
        AND t.date >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
        AND t.date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY year, month
      ORDER BY year, month;
    `;
  }
}
