import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import { TransactionEntity } from '@transactions/domain/entities/transaction';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';

@injectable()
export class TransactionRepositoryAdapter
  extends BaseRepository<TransactionEntity>
  implements ITransactionRepositoryPort
{
  private readonly prisma: PrismaClient;

  public constructor() {
    const prisma = new PrismaClient();

    super(prisma.transaction);
    this.prisma = prisma;
  }
}
