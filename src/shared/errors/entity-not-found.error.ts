import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { HttpStatus } from '@shared/http-status.enum';

export class EntityNotFoundError extends CustomApplicationError {
  constructor(message: string) {
    super(`${message} not found`, HttpStatus.NOT_FOUND, 'EntityNotFoundError');
  }
}
