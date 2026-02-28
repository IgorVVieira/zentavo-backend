import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { GetPendingImportUseCase } from '@transactions/use-cases/get-pending-import/get-pending-import.use-case';
import { Request, Response } from 'express';

@injectable()
export class TransactionImportController {
  constructor(
    @inject(Injections.GET_PENDING_TRANSACTION_IMPORT_USE_CASE)
    private readonly getPendingTransactionImportUseCase: GetPendingImportUseCase,
  ) {}

  async getPendingImport(request: Request, response: Response): Promise<Response> {
    const pendingImport = await this.getPendingTransactionImportUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(pendingImport);
  }
}
