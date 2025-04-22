import { TransactionMethod } from '@transactions/domain/entities/transaction.entity';

export type TransactionsByMethod = {
  method: TransactionMethod;
  total: number;
};
