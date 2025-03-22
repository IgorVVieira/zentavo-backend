import { BaseEntity } from 'shared/domain/entities/base-entity';

export enum TransactionType {
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export class Transaction extends BaseEntity {
  public userId: string;
  public tagId?: string;
  public externalTransactionId: string;
  public date: Date;
  public amount: number;
  public description: string;
  public customName: string;
  public type: TransactionType;
  public bankName?: string;
}
