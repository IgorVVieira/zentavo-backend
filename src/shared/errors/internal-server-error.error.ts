import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { HttpStatus } from '@shared/http-status.enum';

export class InternalServerError extends CustomApplicationError {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'InternalServerError');
  }
}
