import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import {
  TransactionImportEntity,
  TransactionImportStatus,
} from '@transactions/domain/entities/transaction-import.entity';
import { ITransactionImportRepositoryPort } from '@transactions/domain/repositories/transaction-import.repository.port';

import { PrismaClientSingleton } from '../../../prisma-client';

@injectable()
export class TransactionImportRepository
  extends BaseRepository<TransactionImportEntity>
  implements ITransactionImportRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = PrismaClientSingleton.getInstance();

    super(prisma.transactionImport);
    this.prisma = prisma;
  }

  async findNotCopletedByUserId(userId: string): Promise<TransactionImportEntity | null> {
    const transactionImport = await this.prisma.transactionImport.findFirst({
      where: {
        userId,
        status: {
          not: TransactionImportStatus.COMPLETED,
        },
      },
    });

    if (!transactionImport) {
      return null;
    }

    return {
      ...transactionImport,
      status: transactionImport.status as TransactionImportStatus,
    };
  }
}
