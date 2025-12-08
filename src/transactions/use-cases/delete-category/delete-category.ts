import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';

@injectable()
export class DeleteCategoryUseCase implements IBaseUseCase<string, void> {
  constructor(
    @inject(Injections.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryPort,
    @inject(Injections.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  async execute(categoryId: string): Promise<void> {
    await this.categoryRepository.delete(categoryId);

    await this.transactionRepository.deleteCategoryId(categoryId);
  }
}
