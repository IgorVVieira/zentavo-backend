import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { IMessageQueuePort } from '@shared/gateways/message-queue.port';
import { Injections } from '@shared/types/injections';

import { TransactionImportStatus } from '@transactions/domain/entities/transaction-import.entity';
import { ITransactionImportRepositoryPort } from '@transactions/domain/repositories/transaction-import.repository.port';
import { ImportTransactionDto } from '@transactions/dtos';

@injectable()
export class TransactionImportProducerUseCase implements IBaseUseCase<ImportTransactionDto, void> {
  constructor(
    @inject(Injections.MESSAGE_QUEUE_PORT) private readonly messageQueuePort: IMessageQueuePort,
    @inject(Injections.TRANSACTION_IMPORT_REPOSITORY)
    private readonly transactionImportRepository: ITransactionImportRepositoryPort,
  ) {}

  async execute(data: ImportTransactionDto): Promise<void> {
    const transactionImport = await this.transactionImportRepository.create({
      userId: data.userId,
      fileName: data.file.originalname,
      status: TransactionImportStatus.PENDING,
    });

    await this.messageQueuePort.publish<ImportTransactionDto>(
      process.env.QUEUE_PROCESS_TRANSACTIONS as string,
      {
        ...data,
        transactionImportId: transactionImport.id,
      },
    );
  }
}
