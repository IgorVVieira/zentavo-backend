import { BaseEntity } from '@shared/domain/entities/base-entity';

import { CategoryEntity } from '@transactions/domain/entities/category.entity';

export enum TransactionType {
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum TransactionMethod {
  PIX = 'PIX',
  DEBIT = 'DEBIT',
  TRANSFER = 'TRANSFER',
  CARD_PAYMENT = 'CARD_PAYMENT',
  CASH_BACK = 'CASH_BACK',
}

export class TransactionEntity extends BaseEntity {
  userId: string;
  categoryId?: string | null;
  externalId?: string | null;
  amount: number;
  date: Date;
  description: string;
  type: TransactionType;
  method: TransactionMethod;

  category?: CategoryEntity | null;
}
