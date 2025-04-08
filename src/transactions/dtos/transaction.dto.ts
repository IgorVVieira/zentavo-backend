import {
  TransactionMethod,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';

export class TransactionDto {
  id: string;
  userId: string;
  categoryId?: string;
  externalId?: string | null;
  amount: number;
  date: Date;
  description: string;
  type: TransactionType;
  method: TransactionMethod;
}
