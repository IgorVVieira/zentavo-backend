/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { CreateUserDto } from '@users/dtos';
import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';

import { Request, Response } from 'express';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
    @inject('GetMeUseCase')
    private readonly getMeUseCase: GetMeUseCase,
  ) {
    this.create = this.create.bind(this);
    this.getMe = this.getMe.bind(this);
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

  public async getMe(request: Request, response: Response): Promise<any> {
    const userId = request.userId;
    const user = await this.getMeUseCase.execute(userId);

    return response.status(HttpStatus.OK).json(user);
  }
}
