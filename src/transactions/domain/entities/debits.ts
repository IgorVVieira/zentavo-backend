import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum DebitStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class Debit extends BaseEntity {
  name: string;
  transactionId?: string;
  tagId?: string;
  dueDate: Date;
  status: DebitStatus;
  amount: number;
  //   TODO: If is montly, we should create a new entity to represent the montly debit using a job
  isMonthly: boolean;
}
