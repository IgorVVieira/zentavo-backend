import { TransactionImportStatus } from '@transactions/domain/entities/transaction-import.entity';

export class GetPendingImportDto {
  id: string;
  userId: string;
  status: TransactionImportStatus;
  createdAt: string | Date;
}
