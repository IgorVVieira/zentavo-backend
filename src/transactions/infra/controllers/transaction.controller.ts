import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { CreateTransactionUseCase } from '@transactions/use-cases/transactions/create-transaction.use-case';
import { Request, Response } from 'express';

@injectable()
export class TransactionController {
  public constructor(
    @inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
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
}
