/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { LoginUseCase } from '@users/core/use-cases/login.use-case';

@injectable()
export class AuthController {
  constructor(
    @inject('LoginUseCase')
    private readonly loginUserCase: LoginUseCase,
  ) {
    this.login = this.login.bind(this);
  }

  public async login(request: Request, response: Response): Promise<any> {
    const { email, password } = request.body;
    const token = await this.loginUserCase.execute({ email, password });

    return response.status(HttpStatus.OK).json(token);
  }
}
