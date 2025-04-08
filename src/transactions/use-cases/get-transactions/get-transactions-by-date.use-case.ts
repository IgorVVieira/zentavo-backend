import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { GetTransactionsDto, TransactionDto } from '@transactions/dtos';

@injectable()
export class GetTransactionsByDateUseCase
  implements IBaseUseCase<GetTransactionsDto, TransactionDto[]>
{
  public constructor(
    @inject('TransactionRepository')
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  public async execute(data: GetTransactionsDto): Promise<TransactionDto[]> {
    const { userId, month, year } = data;

    const transactions = await this.transactionRepository.findByDate(userId, month, year);

    return transactions.map(transaction => ({
      id: transaction.id as string,
      userId: transaction.userId,
      type: transaction.type,
      method: transaction.method,
      externalId: transaction.externalId,
      description: transaction.description,
      date: transaction.date,
      amount: transaction.amount,
      category: {
        id: transaction?.category?.id,
        color: transaction?.category?.color,
        name: transaction?.category?.name,
      },
    }));
  }
}
