import { container } from 'tsyringe';

import { ICategoryRepositoryPort } from '@transactions//domain/repositories/category.repositor.port';
import { NubankStatementCsvParser } from '@transactions/adapters/gateways/nubank-statement-csv-parser.adapter';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionRepositoryAdapter } from '@transactions/adapters/repositories/transaction.repository.adapter';
import { CategoryController } from '@transactions/controllers/category.controller';
import { TransactionController } from '@transactions/controllers/transaction.controller';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { ICsvStatementParser } from '@transactions/gateways/csv-statement-parser.interface';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
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

container.registerSingleton<ICsvStatementParser>('CsvStatementParser', NubankStatementCsvParser);

container.registerSingleton('CreateCategoryUseCase', CreateCategoryUseCase);
container.registerSingleton('CreateTransactionUseCase', CreateTransactionUseCase);
container.registerSingleton('GetTransactionsByDateUseCase', GetTransactionsByDateUseCase);
container.registerSingleton('ListCategoriesUseCase', ListCategoriesUseCase);
container.registerSingleton('UpdateTransactionUseCase', UpdateTransactionUseCase);

container.registerSingleton(TransactionController);
container.registerSingleton(CategoryController);

export { container };
