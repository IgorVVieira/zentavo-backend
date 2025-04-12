import { HttpStatus } from '@shared/http-status.enum';

export abstract class CustomApplicationError extends Error {
  constructor(
    message: string,
    readonly statusCode: HttpStatus,
    name: string,
  ) {
    super(message);
    this.name = name;
  }

  getBody(): object {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.name,
    };
  }
}
