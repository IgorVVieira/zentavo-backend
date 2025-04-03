import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { HttpStatus } from '@shared/http-status.enum';

export class EntityAlreadyExistsError extends CustomApplicationError {
  constructor(message: string) {
    super(`${message} already exists`, HttpStatus.BAD_REQUEST, 'EntityAlreadyExistsError');
  }
}
