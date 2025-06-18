import { inject, injectable } from 'tsyringe';

import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { GetTransactionsDto } from '@transactions/dtos';
import {
  TransactionsByCategoryDto,
  TransactionsByMethodDto,
  TransactionsLastSixMonthsDto,
} from '@transactions/dtos/dashboard.dto';

@injectable()
export class DashboardUseCase {
  constructor(
    @inject('TransactionRepository')
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  async listByPaymentMethod(data: GetTransactionsDto): Promise<TransactionsByMethodDto[]> {
    return this.transactionRepository.listByPaymentMethod(data);
  }

  async listByCategory(data: GetTransactionsDto): Promise<TransactionsByCategoryDto[]> {
    return this.transactionRepository.listByCategory(data);
  }

  async listByLastSixMonths(userId: string): Promise<TransactionsLastSixMonthsDto[]> {
    return this.transactionRepository.listByLastSixMonths(userId);
  }
}
