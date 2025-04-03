import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { HttpStatus } from '@shared/http-status.enum';

export class InternalServerError extends CustomApplicationError {
  constructor(error: Error) {
    super(error.message, HttpStatus.INTERNAL_SERVER_ERROR, 'InternalServerError');
  }
}
