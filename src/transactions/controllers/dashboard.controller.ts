import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { TransactionType } from '@transactions/domain/entities/transaction.entity';
import { DashboardUseCase } from '@transactions/use-cases/dashboard/dashboard.use-case';
import { Request, Response } from 'express';

@injectable()
export class DashboardController {
  constructor(
    @inject(Injections.DASHBOARD_USE_CASE) private readonly dashboardUseCase: DashboardUseCase,
  ) {}

  // @OpenAPI({
  //   summary: 'List transactions by payment method',
  //   description: 'List transactions by payment method for the user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'List of transactions by payment method',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid data',
  //     },
  //   },
  // })
  // @ResponseSchema(TransactionsByMethodDto, { isArray: true })
  async listByPaymentMethod(request: Request, response: Response): Promise<Response> {
    const transactions = await this.dashboardUseCase.listByPaymentMethod({
      month: +request.params.month,
      year: +request.params.year,
      userId: request.userId,
    });

    return response.status(HttpStatus.OK).json(transactions);
  }

  // @OpenAPI({
  //   summary: 'List transactions by category',
  //   description: 'List transactions by category for the user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'List of transactions by category',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid data',
  //     },
  //   },
  // })
  // @ResponseSchema(TransactionsByCategoryDto, { isArray: true })
  async listByCategory(request: Request, response: Response): Promise<Response> {
    const { month, year, transactionType } = request.params;

    const categories = await this.dashboardUseCase.listByCategory({
      month: +month,
      year: +year,
      transactionType: transactionType as TransactionType,
      userId: request.userId,
    });

    return response.status(HttpStatus.OK).json(categories);
  }

  // @OpenAPI({
  //   summary: 'List transactions for the last six months',
  //   description: 'List transactions for the last six months for the user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'List of transactions for the last six months',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid data',
  //     },
  //   },
  // })
  // @ResponseSchema(TransactionsLastSixMonthsDto, { isArray: true })
  async listByLastSixMonths(request: Request, response: Response): Promise<Response> {
    const data = await this.dashboardUseCase.listByLastSixMonths(request.userId);

    return response.status(HttpStatus.OK).json(data);
  }
}
