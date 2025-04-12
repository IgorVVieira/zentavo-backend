import multer from 'multer';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UploadedFile,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { TransactionDto, UpdateTransactionDto } from '@transactions/dtos';
import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';

// Configurando o middleware multer para uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

@injectable()
@JsonController('/transactions')
@Authorized() // Aplica o middleware de autenticação para todas as rotas
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
    description: 'Import transactions from a CSV file',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              statement: {
                type: 'string',
                format: 'binary',
                description: 'CSV file containing transaction data',
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Transactions imported successfully',
      },
      '400': {
        description: 'Bad request - Invalid file',
      },
    },
  })
  @UseBefore(upload.single('statement'))
  async importData(
    @CurrentUser() userId: string,
    @UploadedFile('statement') file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    await this.createTransactionUseCase.execute({
      userId,
      file,
    });

    return { message: 'File imported successfully' };
  }

  @Get('/:month/:year')
  @OpenAPI({
    summary: 'Get transactions by date',
    description: 'Get transactions filtered by month and year',
    responses: {
      '200': {
        description: 'Transactions retrieved successfully',
      },
    },
  })
  @ResponseSchema(TransactionDto, { isArray: true })
  async getTransactionsByDate(
    @Param('month') month: string,
    @Param('year') year: string,
    @CurrentUser() userId: string,
  ): Promise<TransactionDto[]> {
    return this.getTransactionsByDateUseCase.execute({
      userId,
      month: Number(month),
      year: Number(year),
    });
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
