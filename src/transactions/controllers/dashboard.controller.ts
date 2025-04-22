import { Authorized, CurrentUser, Get, JsonController, Param } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { TransactionsByMethodDto } from '@transactions/dtos/transactions-by-method.dto';
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
}
