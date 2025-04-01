import { container } from 'tsyringe';

import { ICategoryRepositoryPort } from '@transactions//domain/repositories/category.repositor.port';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionController } from '@transactions/infra/controllers/transaction.controller';
import { CreateCategoryUseCase } from '@transactions/use-cases/category/create-category.use-case';

container.registerSingleton<ICategoryRepositoryPort>(
  'CategoryRepository',
  CategoryRepositoryAdapter,
);

container.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);

container.registerSingleton(TransactionController);

export { container };
