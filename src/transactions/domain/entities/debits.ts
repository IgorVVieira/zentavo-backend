import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum DebitStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class Debit extends BaseEntity {
  public name: string;
  public transactionId?: string;
  public tagId?: string;
  public dueDate: Date;
  public status: DebitStatus;
  public amount: number;
  //   TODO: If is montly, we should create a new entity to represent the montly debit using a job
  public isMonthly: boolean;
}
