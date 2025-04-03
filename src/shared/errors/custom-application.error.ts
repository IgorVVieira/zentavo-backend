import { HttpStatus } from '@shared/http-status.enum';

export class CustomApplicationError extends Error {
  constructor(
    message: string,
    protected readonly statusCode: HttpStatus,
    name: string,
  ) {
    super(message);
    this.name = name;
  }
}
