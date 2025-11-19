import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { TransactionEntity } from '@transactions/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { CreateTransactionDto } from '@transactions/dtos';
import { IOfxStatementParser } from '@transactions/gateways/ofx-statement-parser.interface';

@injectable()
export class CreateTransactionUseCase implements IBaseUseCase<CreateTransactionDto, void> {
  constructor(
    @inject('TransactionRepository')
    private readonly transactionRepository: ITransactionRepositoryPort,
    @inject('OfxStatementParser')
    private readonly ofxStatementParser: IOfxStatementParser,
  ) {}

  async execute(data: CreateTransactionDto): Promise<void> {
    const { userId, file } = data;
    const transactions = await this.ofxStatementParser.parse(file?.buffer?.toString('utf-8') ?? '');
    const transactionsToCreate = transactions.map(transaction => ({
      ...transaction,
      userId,
    }));

    const batchSize = 10;
    const batch: TransactionEntity[] = [];

    try {
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
    } catch (error) {
      console.error('Erro ao criar transações:', error);
      throw new Error('Erro ao processar transações');
    }
  }
}
