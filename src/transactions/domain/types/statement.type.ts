import { TransactionMethod, TransactionType } from '../entities/transaction.entity';

export type Statement = {
  externalId: string;
  date: Date;
  amount: number;
  description: string;
  type: TransactionType;
  method: TransactionMethod;
};
