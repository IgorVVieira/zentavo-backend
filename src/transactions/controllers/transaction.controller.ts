import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { TransactionImportProducerUseCase } from '@transactions/use-cases/transaction-import-producer/transaction-import-producer.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';
import { Request, Response } from 'express';

@injectable()
export class TransactionController {
  constructor(
    @inject(Injections.TRANSACTION_IMPORT_PRODUCER_USE_CASE)
    private readonly transactionImportProducerUseCase: TransactionImportProducerUseCase,
    @inject(Injections.GET_TRANSACTIONS_BY_DATE_USE_CASE)
    private readonly getTransactionsByDateUseCase: GetTransactionsByDateUseCase,
    @inject(Injections.UPDATE_TRANSACTION_USE_CASE)
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  async importOfx(request: Request, response: Response): Promise<Response> {
    const { userId, file, body } = request;

    if (!file) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
    }

    await this.transactionImportProducerUseCase.execute({
      userId,
      file,
      useLlm: Boolean(body.useLlm),
    });

    return response.status(HttpStatus.OK).json({ message: 'File imported successfully' });
  }

  async getTransactionsByDate(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.params;
    const { userId } = request;

    const transactions = await this.getTransactionsByDateUseCase.execute({
      userId,
      month: +month,
      year: +year,
    });

    return response.status(HttpStatus.OK).json(transactions);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { userId } = request;

    const transaction = await this.updateTransactionUseCase.execute({
      ...request.body,
      id,
      userId,
    });

    return response.status(HttpStatus.OK).json(transaction);
  }
}
