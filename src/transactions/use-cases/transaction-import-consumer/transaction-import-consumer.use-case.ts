import { inject, injectable } from 'tsyringe';

import { IMessageConsumerUseCase } from '@shared/domain/use-cases/message-consumer.use-case';
import { IMessageQueuePort } from '@shared/gateways/message-queue.port';
import { Injections } from '@shared/types/injections';
import { Logger } from '@shared/utils/logger';

import { TransactionEntity } from '@transactions/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { ImportTransactionDto } from '@transactions/dtos';
import { IOfxStatementParser } from '@transactions/gateways/ofx-statement-parser.interface';

@injectable()
export class TransactionImportConsumerUseCase implements IMessageConsumerUseCase {
  constructor(
    @inject(Injections.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryPort,
    @inject(Injections.OFX_STATEMENT_PARSER)
    private readonly ofxStatementParser: IOfxStatementParser,
    @inject(Injections.MESSAGE_QUEUE_PORT) private readonly messageQueuePort: IMessageQueuePort,
  ) {}

  async start(): Promise<void> {
    await this.messageQueuePort.subscribe<ImportTransactionDto>(
      process.env.QUEUE_PROCESS_TRANSACTIONS as string,
      async data => this.processOfxStatementMessage(data),
    );
  }

  private async processOfxStatementMessage(data: ImportTransactionDto): Promise<void> {
    try {
      const { userId, file } = data;
      const serialized = file.buffer as unknown as { data: number[] };
      const buffer = Buffer.from(serialized.data);
      const content = buffer.toString('utf8') || buffer.toString('latin1');
      const transactions = await this.ofxStatementParser.parse(content ?? '');

      const transactionsToCreate = transactions.map(transaction => ({
        ...transaction,
        userId,
      }));

      const batchSize = 10;
      const batch: TransactionEntity[] = [];

      for (const transaction of transactionsToCreate) {
        const transactionExists = await this.transactionRepository.findByExternalIdAndUserId(
          transaction.externalId,
          transaction.userId,
        );

        if (!transactionExists) {
          batch.push(transaction);
        }
        if (batch.length === batchSize) {
          await this.transactionRepository.createMany(batch);
          batch.length = 0;
        }
      }
      if (batch.length) {
        await this.transactionRepository.createMany(batch);
      }
      Logger.info('Message processed successfully');
    } catch (error) {
      Logger.error('Erro ao processar ofx da fila:', error);
    }
  }
}
