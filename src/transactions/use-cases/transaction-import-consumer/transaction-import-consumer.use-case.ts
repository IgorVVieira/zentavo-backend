import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { IMessageConsumerUseCase } from '@shared/domain/use-cases/message-consumer.use-case';
import { IMessageQueuePort } from '@shared/gateways/message-queue.port';
import { Injections } from '@shared/types/injections';
import { Logger } from '@shared/utils/logger';

import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { ImportTransactionDto } from '@transactions/dtos';
import {
  LlmCategorizeDto,
  LlmCategorizeDtoResponseDto,
} from '@transactions/dtos/llm-categorize.dto';
import { IOfxStatementParser } from '@transactions/ports/ofx-statement-parser.interface';

@injectable()
export class TransactionImportConsumerUseCase implements IMessageConsumerUseCase {
  /* eslint-disable-next-line max-params */
  constructor(
    @inject(Injections.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryPort,
    @inject(Injections.OFX_STATEMENT_PARSER)
    private readonly ofxStatementParser: IOfxStatementParser,
    @inject(Injections.MESSAGE_QUEUE_PORT) private readonly messageQueuePort: IMessageQueuePort,
    @inject(Injections.LLM_CATEGORY_USE_CASE)
    private readonly llmCategoryUseCase: IBaseUseCase<
      LlmCategorizeDto,
      LlmCategorizeDtoResponseDto[]
    >,
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
      const content = buffer.toString('utf8');
      const transactions = await this.ofxStatementParser.parse(content ?? '');

      const transactionsToCreate = transactions.map(transaction => ({
        ...transaction,
        userId,
      }));

      const externalIds = transactionsToCreate.map(transaction => transaction.externalId);
      const existingTransactions = await this.transactionRepository.findByExternalIdListAndUserId(
        externalIds,
        userId,
      );

      const existingExternalIds =
        existingTransactions?.map(transaction => transaction.externalId) || [];
      const newExternalIds = externalIds.filter(id => !existingExternalIds.includes(id));

      const newTransactions = transactionsToCreate.filter(transaction =>
        newExternalIds.includes(transaction.externalId),
      );

      if (!newTransactions?.length) {
        Logger.info('No new transactions found to import');

        return;
      }

      let transactionsToSave = newTransactions;

      if (data.useLlm) {
        const categorizedTransactions = await this.llmCategoryUseCase.execute({
          userId,
          transactions: newTransactions,
        });

        transactionsToSave = newTransactions.map(transaction => {
          const categorized = categorizedTransactions?.find(
            c => c.externalId === transaction.externalId,
          );

          return {
            ...transaction,
            categoryId: categorized?.categoryId ?? transaction.categoryId,
          };
        });
      }

      await this.transactionRepository.createMany(transactionsToSave);
      Logger.info('Message processed successfully');
    } catch (error) {
      Logger.error('Erro ao processar ofx da fila:', error);
    }
  }
}
