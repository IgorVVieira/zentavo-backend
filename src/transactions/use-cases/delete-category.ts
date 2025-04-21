import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repositor.port';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';

@injectable()
export class DeleteCategoryUseCase implements IBaseUseCase<string, void> {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepositoryPort,
    @inject('TransactionRepository')
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  async execute(categoryId: string): Promise<void> {
    await this.categoryRepository.delete(categoryId);

    await this.transactionRepository.deleteCategoryId(categoryId);
  }
}
