import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { HttpStatus } from '@shared/http-status.enum';

export class ForbiddenError extends CustomApplicationError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN, 'ForbiddenError');
  }
}
