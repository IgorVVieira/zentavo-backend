import { Authorized, CurrentUser, Get, JsonController, Param } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import {
  TransactionsByCategoryDto,
  TransactionsByMethodDto,
  TransactionsLastSixMonthsDto,
} from '@transactions/dtos/dashboard.dto';
import { DashboardUseCase } from '@transactions/use-cases/dashboard/dashboard.use-case';

@injectable()
@Authorized()
@JsonController('/transactions/dashboard')
export class DashboardController {
  constructor(
    @inject('DashboardUseCase')
    private readonly dashboardUseCase: DashboardUseCase,
  ) {}

  @Get('/payment-methods/:month/:year')
  @Authorized()
  @OpenAPI({
    summary: 'List transactions by payment method',
    description: 'List transactions by payment method for the user',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'List of transactions by payment method',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
    },
  })
  @ResponseSchema(TransactionsByMethodDto, { isArray: true })
  async listByPaymentMethod(
    @Param('month') month: string,
    @Param('year') year: string,
    @CurrentUser() userId: string,
  ): Promise<TransactionsByMethodDto[]> {
    return this.dashboardUseCase.listByPaymentMethod({
      month: Number(month),
      year: Number(year),
      userId,
    });
  }

  @Get('/categories/:month/:year')
  @Authorized()
  @OpenAPI({
    summary: 'List transactions by category',
    description: 'List transactions by category for the user',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'List of transactions by category',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
    },
  })
  @ResponseSchema(TransactionsByCategoryDto, { isArray: true })
  async listByCategory(
    @Param('month') month: string,
    @Param('year') year: string,
    @CurrentUser() userId: string,
  ): Promise<TransactionsByCategoryDto[]> {
    return this.dashboardUseCase.listByCategory({
      month: Number(month),
      year: Number(year),
      userId,
    });
  }

  @Get('/last-six-months')
  @Authorized()
  @OpenAPI({
    summary: 'List transactions for the last six months',
    description: 'List transactions for the last six months for the user',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'List of transactions for the last six months',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
    },
  })
  @ResponseSchema(TransactionsLastSixMonthsDto, { isArray: true })
  async listByLastSixMonths(
    @CurrentUser() userId: string,
  ): Promise<TransactionsLastSixMonthsDto[]> {
    return this.dashboardUseCase.listByLastSixMonths(userId);
  }
}
