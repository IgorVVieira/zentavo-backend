import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { TransactionEntity } from '@transactions/domain/entities/transaction';

export type ITransactionRepositoryPort = IBaseRepository<TransactionEntity>;
