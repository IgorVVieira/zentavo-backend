import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import {
  TransactionEntity,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';
import {
  TransactionsByCategory,
  TransactionsByMethod,
  TransactionsLastSixMonths,
} from '@transactions/domain/types/dashboard.type';
import { GetTransactionsDto } from '@transactions/dtos';

export type FindByDateParams = {
  userId: string;
  month: number;
  year: number;
  transactionType?: TransactionType;
};

export interface ITransactionRepositoryPort extends IBaseRepository<TransactionEntity> {
  findByExternalIdAndUserId(externalId: string, userId: string): Promise<TransactionEntity | null>;
  findByExternalIdListAndUserId(
    externalIds: string[],
    userId: string,
  ): Promise<TransactionEntity[]>;
  findByDate(params: FindByDateParams): Promise<TransactionEntity[]>;
  listByPaymentMethod(params: FindByDateParams): Promise<TransactionsByMethod[]>;
  listByCategory(params: FindByDateParams): Promise<TransactionsByCategory[]>;
  listByLastSixMonths(params: GetTransactionsDto): Promise<TransactionsLastSixMonths[]>;
  deleteCategoryId(categoryId: string): Promise<void>;
}
