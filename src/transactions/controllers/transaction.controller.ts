import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';
import { Request, Response } from 'express';

@injectable()
export class TransactionController {
  public constructor(
    @inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    @inject('GetTransactionsByDateUseCase')
    private readonly getTransactionsByDateUseCase: GetTransactionsByDateUseCase,
    @inject('UpdateTransactionUseCase')
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  public async importData(req: Request, resp: Response): Promise<void> {
    const file = req.file;

    if (!file) {
      resp.status(HttpStatus.BAD_REQUEST).send('No file uploaded');

      return;
    }

    const userId = req.userId;

    await this.createTransactionUseCase.execute({
      userId,
      file: req.file as Express.Multer.File,
    });

    resp.status(HttpStatus.OK).json({
      message: 'File imported successfully',
    });
  }

  public async getTransactionsByDate(req: Request, resp: Response): Promise<void> {
    const { month, year } = req.params;

    const { userId } = req;

    const transactions = await this.getTransactionsByDateUseCase.execute({
      userId,
      month: Number(month),
      year: Number(year),
    });

    resp.status(HttpStatus.OK).json(transactions);
  }

  public async update(req: Request, resp: Response): Promise<void> {
    const { id } = req.params;

    const { userId } = req;

    const transactionData = {
      ...req.body,
      id,
      userId,
    };

    const transaction = await this.updateTransactionUseCase.execute(transactionData);

    resp.status(HttpStatus.OK).json(transaction);
  }
}
