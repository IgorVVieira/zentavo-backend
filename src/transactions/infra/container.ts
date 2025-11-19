import { container } from 'tsyringe';

import { ICategoryRepositoryPort } from '@transactions//domain/repositories/category.repositor.port';
import { OfxStatementParserGateway } from '@transactions/adapters/gateways/ofx-statement-parser.gateway';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionRepositoryAdapter } from '@transactions/adapters/repositories/transaction.repository.adapter';
import { CategoryController } from '@transactions/controllers/category.controller';
import { DashboardController } from '@transactions/controllers/dashboard.controller';
import { TransactionController } from '@transactions/controllers/transaction.controller';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { IOfxStatementParser } from '@transactions/gateways/ofx-statement-parser.interface';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
import { DashboardUseCase } from '@transactions/use-cases/dashboard/dashboard.use-case';
import { DeleteCategoryUseCase } from '@transactions/use-cases/delete-category/delete-category';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';

container.registerSingleton<ICategoryRepositoryPort>(
  'CategoryRepository',
  CategoryRepositoryAdapter,
);
container.registerSingleton<ITransactionRepositoryPort>(
  'TransactionRepository',
  TransactionRepositoryAdapter,
);

container.registerSingleton<IOfxStatementParser>('OfxStatementParser', OfxStatementParserGateway);

container.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);
container.registerSingleton('ListCategoriesUseCase', ListCategoriesUseCase);
container.registerSingleton('DeleteCategoryUseCase', DeleteCategoryUseCase);

container.registerSingleton('CreateTransactionUseCase', CreateTransactionUseCase);
container.registerSingleton('GetTransactionsByDateUseCase', GetTransactionsByDateUseCase);
container.registerSingleton('UpdateTransactionUseCase', UpdateTransactionUseCase);
container.registerSingleton('DashboardUseCase', DashboardUseCase);

container.registerSingleton(TransactionController);
container.registerSingleton(CategoryController);
container.registerSingleton(DashboardController);

export { container };
