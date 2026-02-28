import { BaseEntity } from '@shared/domain/entities/base-entity';

export enum TransactionImportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class TransactionImportEntity extends BaseEntity {
  status: TransactionImportStatus;
  userId: string;
  fileName: string;
}
