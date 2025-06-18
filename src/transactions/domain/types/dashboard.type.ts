import { TransactionMethod } from '@transactions/domain/entities/transaction.entity';

export type TransactionsByMethod = {
  method: TransactionMethod;
  total: number;
};

export type TransactionsByCategory = {
  id: string;
  name: string;
  color: string;
  total: number;
  percentage: number;
};

export type TransactionsLastSixMonths = {
  month: number;
  year: number;
  totalCashIn: number;
  totalCashOut: number;
};
