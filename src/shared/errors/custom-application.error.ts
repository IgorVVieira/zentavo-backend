import { HttpStatus } from '@shared/http-status.enum';

export abstract class CustomApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: HttpStatus,
    name: string,
  ) {
    super(message);
    this.name = name;
  }

  public getBody(): object {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.name,
    };
  }
}
