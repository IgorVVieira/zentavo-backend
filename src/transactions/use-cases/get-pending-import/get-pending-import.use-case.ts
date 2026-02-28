import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';

import { ITransactionImportRepositoryPort } from '@transactions/domain/repositories/transaction-import.repository.port';
import { GetPendingImportDto } from '@transactions/dtos/get-pending-import.dto';

@injectable()
export class GetPendingImportUseCase implements IBaseUseCase<string, GetPendingImportDto | null> {
  constructor(
    @inject(Injections.TRANSACTION_IMPORT_REPOSITORY)
    private readonly transactionImportRepository: ITransactionImportRepositoryPort,
  ) {}

  async execute(userId: string): Promise<GetPendingImportDto | null> {
    const pendingImport = await this.transactionImportRepository.findNotCopletedByUserId(userId);

    if (!pendingImport) {
      return null;
    }

    return {
      id: pendingImport.id as string,
      userId: pendingImport.userId,
      status: pendingImport.status,
      createdAt: pendingImport.createdAt as Date,
    };
  }
}
