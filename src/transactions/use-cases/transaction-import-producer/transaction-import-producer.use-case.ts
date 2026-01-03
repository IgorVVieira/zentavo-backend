import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { IMessageQueuePort } from '@shared/gateways/message-queue.port';
import { Injections } from '@shared/types/injections';

import { ImportTransactionDto } from '@transactions/dtos';

@injectable()
export class TransactionImportProducerUseCase implements IBaseUseCase<ImportTransactionDto, void> {
  constructor(
    @inject(Injections.MESSAGE_QUEUE_PORT) private readonly messageQueuePort: IMessageQueuePort,
  ) {}

  async execute(data: ImportTransactionDto): Promise<void> {
    await this.messageQueuePort.publish<ImportTransactionDto>(
      process.env.QUEUE_PROCESS_TRANSACTIONS as string,
      data,
    );
  }
}
