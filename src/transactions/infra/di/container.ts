import { container } from 'tsyringe';

import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { ICategoryRepositoryPort } from '@transactions/core/domain/repositories/category.repositor.port';
import { CreateCategoryUseCase } from '@transactions/core/use-cases/category/create-category.use-case';

container.registerSingleton<ICategoryRepositoryPort>(
  'CategoryRepository',
  CategoryRepositoryAdapter,
);

container.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);

export { container };
