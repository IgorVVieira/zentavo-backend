import { TransactionMethod, TransactionType } from '../entities/transaction.entity';

export type Statement = {
  externalId: string;
  date: Date;
  amount: number;
  description: string;
  type: TransactionType;
  method: TransactionMethod;
};

export enum OfxStatementType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export type OfxStatement = {
  TRNTYPE: OfxStatementType;
  DTPOSTED: string;
  MEMO: string;
  TRNAMT: string;
  FITID: string;
};
