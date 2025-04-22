import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { TransactionEntity } from '@transactions/domain/entities/transaction.entity';
import { TransactionsByMethod } from '@transactions/domain/types/transactions-by-method';

export type FindByDateParams = {
  userId: string;
  month: number;
  year: number;
};

export interface ITransactionRepositoryPort extends IBaseRepository<TransactionEntity> {
  findByExternalIdAndUserId(externalId: string, userId: string): Promise<TransactionEntity | null>;

  findByDate(params: FindByDateParams): Promise<TransactionEntity[]>;

  listByPaymentMethod(params: FindByDateParams): Promise<TransactionsByMethod[]>;

  deleteCategoryId(categoryId: string): Promise<void>;
}
