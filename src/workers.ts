import { container } from 'tsyringe';

import { Injections } from '@shared/types/injections';

import { TransactionImportConsumerUseCase } from '@transactions/use-cases/transaction-import-consumer/transaction-import-consumer.use-case';

export async function startConsumers(): Promise<void> {
  const consumer = container.resolve<TransactionImportConsumerUseCase>(
    Injections.TRANSACTION_IMPORT_CONSUMER_USE_CASE,
  );

  await consumer.start();
}
