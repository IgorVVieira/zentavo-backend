/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { CreateUserDto } from '@users/application/dtos';
import { CreateUserUseCase } from '@users/core/use-cases/create-user.use-case';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
  ) {
    this.create = this.create.bind(this);
  }

  public async create(request: Request, response: Response): Promise<any> {
    const body: CreateUserDto = {
      email: request.body.email,
      password: request.body.password,
      name: request.body.name,
    };
    const user = await this.createUserUseCase.execute(body);

    return response.status(HttpStatus.CREATED).json(user);
  }
}
