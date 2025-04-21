import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { TransactionEntity } from '@transactions/domain/entities/transaction.entity';

export interface ITransactionRepositoryPort extends IBaseRepository<TransactionEntity> {
  findByExternalIdAndUserId(externalId: string, userId: string): Promise<TransactionEntity | null>;

  findByDate(userId: string, month: number, year: number): Promise<TransactionEntity[]>;

  deleteCategoryId(categoryId: string): Promise<void>;
}
