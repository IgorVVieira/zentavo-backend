import { Body, CurrentUser, JsonController, Param, Post, Put } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { TransactionDto, UpdateTransactionDto } from '@transactions/dtos';
import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';
import { Request, Response } from 'express';

@injectable()
@JsonController('/transactions')
export class TransactionController {
  constructor(
    @inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    @inject('GetTransactionsByDateUseCase')
    private readonly getTransactionsByDateUseCase: GetTransactionsByDateUseCase,
    @inject('UpdateTransactionUseCase')
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  @Post('/import')
  @OpenAPI({
    summary: 'Import transactions from a file',
    description: 'Import transactions from a file',
    responses: {
      '200': {
        description: 'Transactions imported successfully',
      },
      '400': {
        description: 'Bad request - Invalid file',
      },
    },
  })
  @ResponseSchema(TransactionDto)
  async importData(
    @CurrentUser() userId: string,
    @Body() file: Express.Multer.File,
  ): Promise<void> {
    return this.createTransactionUseCase.execute({
      userId,
      file,
    });
  }

  async getTransactionsByDate(req: Request, resp: Response): Promise<void> {
    const { month, year } = req.params;

    const { userId } = req;

    const transactions = await this.getTransactionsByDateUseCase.execute({
      userId,
      month: Number(month),
      year: Number(year),
    });

    resp.status(HttpStatus.OK).json(transactions);
  }

  @Put('/:id')
  @OpenAPI({
    summary: 'Update a transaction',
    description: 'Update a transaction by ID',
    responses: {
      '200': {
        description: 'Transaction updated successfully',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
      '404': {
        description: 'Transaction not found',
      },
    },
  })
  @ResponseSchema(TransactionDto)
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() userId: string,
  ): Promise<TransactionDto> {
    return this.updateTransactionUseCase.execute({
      ...updateTransactionDto,
      id,
      userId,
    });
  }
}
