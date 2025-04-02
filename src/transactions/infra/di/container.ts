import { container } from 'tsyringe';

import { ICategoryRepositoryPort } from '@transactions//domain/repositories/category.repositor.port';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionRepositoryAdapter } from '@transactions/adapters/repositories/transaction.repository.adapter';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { TransactionController } from '@transactions/infra/controllers/transaction.controller';
import { CreateCategoryUseCase } from '@transactions/use-cases/category/create-category.use-case';

container.registerSingleton<ICategoryRepositoryPort>(
  'CategoryRepository',
  CategoryRepositoryAdapter,
);
container.registerSingleton<ITransactionRepositoryPort>(
  'TransactionRepository',
  TransactionRepositoryAdapter,
);

container.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);

container.registerSingleton(TransactionController);

export { container };
