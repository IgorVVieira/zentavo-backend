import { container } from 'tsyringe';

import { RabbitMQQueueAdapter } from '@shared/adapters/rabbitmq-queue.adapter';
import { Injections } from '@shared/types/injections';

import { OfxStatementParserGateway } from '@transactions/adapters/gateways/ofx-statement-parser.gateway';
import { CategoryRepositoryAdapter } from '@transactions/adapters/repositories/category.repository.adapter';
import { TransactionRepositoryAdapter } from '@transactions/adapters/repositories/transaction.repository.adapter';
import { CategoryController } from '@transactions/controllers/category.controller';
import { DashboardController } from '@transactions/controllers/dashboard.controller';
import { TransactionController } from '@transactions/controllers/transaction.controller';
import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';
import { ITransactionRepositoryPort } from '@transactions/domain/repositories/transaction.repository.port';
import { IOfxStatementParser } from '@transactions/gateways/ofx-statement-parser.interface';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { DashboardUseCase } from '@transactions/use-cases/dashboard/dashboard.use-case';
import { DeleteCategoryUseCase } from '@transactions/use-cases/delete-category/delete-category';
import { GetTransactionsByDateUseCase } from '@transactions/use-cases/get-transactions/get-transactions-by-date.use-case';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';
import { TransactionImportConsumerUseCase } from '@transactions/use-cases/transaction-import-consumer/transaction-import-consumer.use-case';
import { TransactionImportProducerUseCase } from '@transactions/use-cases/transaction-import-producer/transaction-import-producer.use-case';
import { UpdateCategoryUseCase } from '@transactions/use-cases/update-category/update-category.use-case';
import { UpdateTransactionUseCase } from '@transactions/use-cases/update-transaction/update-transaction.use-case';

container.registerSingleton<ICategoryRepositoryPort>(
  Injections.CATEGORY_REPOSITORY,
  CategoryRepositoryAdapter,
);
container.registerSingleton<ITransactionRepositoryPort>(
  Injections.TRANSACTION_REPOSITORY,
  TransactionRepositoryAdapter,
);

container.registerSingleton<IOfxStatementParser>(
  Injections.OFX_STATEMENT_PARSER,
  OfxStatementParserGateway,
);

container.registerSingleton(Injections.CREATE_CATEGORY_USE_CASE, CreateCategoryUseCase);
container.registerSingleton(Injections.LIST_CATEGORIES_USE_CASE, ListCategoriesUseCase);
container.registerSingleton(Injections.DELETE_CATEGORY_USE_CASE, DeleteCategoryUseCase);
container.registerSingleton(Injections.UPDATE_CATEGORY_USE_CASE, UpdateCategoryUseCase);

container.registerSingleton(
  Injections.TRANSACTION_IMPORT_PRODUCER_USE_CASE,
  TransactionImportProducerUseCase,
);

container.registerSingleton(
  Injections.TRANSACTION_IMPORT_CONSUMER_USE_CASE,
  TransactionImportConsumerUseCase,
);
container.registerSingleton(
  Injections.GET_TRANSACTIONS_BY_DATE_USE_CASE,
  GetTransactionsByDateUseCase,
);
container.registerSingleton(Injections.UPDATE_TRANSACTION_USE_CASE, UpdateTransactionUseCase);
container.registerSingleton(Injections.DASHBOARD_USE_CASE, DashboardUseCase);

container.registerSingleton(Injections.MESSAGE_QUEUE_PORT, RabbitMQQueueAdapter);

container.registerSingleton(TransactionController);
container.registerSingleton(CategoryController);
container.registerSingleton(DashboardController);

export { container };
