import { inject, injectable } from 'tsyringe';

import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { GetTransactionsDto } from '@transactions/dtos';
import { TransactionsByMethodDto } from '@transactions/dtos/transactions-by-method.dto';

@injectable()
export class DashboardUseCase {
  constructor(
    @inject('TransactionRepository')
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  async listByPaymentMethod(data: GetTransactionsDto): Promise<TransactionsByMethodDto[]> {
    return this.transactionRepository.listByPaymentMethod(data);
  }
}
