import { container } from 'tsyringe';

import { ICategoryRepositoryPort } from '@transactions//domain/repositories/category.repositor.port';
import { NubankStatementCsvParser } from '@transactions/adapters/gateways/nubank-statement-csv-parser.adapter';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionRepositoryAdapter } from '@transactions/adapters/repositories/transaction.repository.adapter';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { ICsvStatementParser } from '@transactions/gateways/csv-statement-parser.interface';
import { TransactionController } from '@transactions/infra/controllers/transaction.controller';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { CreateTransactionUseCase } from '@transactions/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';

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

container.registerSingleton(TransactionController);

export { container };
