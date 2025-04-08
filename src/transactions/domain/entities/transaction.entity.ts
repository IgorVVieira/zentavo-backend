import { BaseEntity } from '@shared/domain/entities/base-entity';

import { CategoryEntity } from '@transactions/domain/entities/category';

export enum TransactionType {
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum TransactionMethod {
  PIX = 'PIX',
  DEBIT = 'DEBIT',
  TRANSFER = 'TRANSFER',
  CARD_PAYMENT = 'CARD_PAYMENT',
}

export class TransactionEntity extends BaseEntity {
  public userId: string;
  public categoryId?: string | null;
  public externalId?: string | null;
  public amount: number;
  public date: Date;
  public description: string;
  public type: TransactionType;
  public method: TransactionMethod;

  public category?: CategoryEntity | null;
}
