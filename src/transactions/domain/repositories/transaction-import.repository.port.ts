import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { TransactionImportEntity } from '../entities/transaction-import.entity';

export interface ITransactionImportRepositoryPort extends IBaseRepository<TransactionImportEntity> {
  findNotCopletedByUserId(userId: string): Promise<TransactionImportEntity | null>;
}
