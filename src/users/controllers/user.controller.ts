import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';

import { Request, Response } from 'express';

@injectable()
export class UserController {
  constructor(
    @inject(Injections.CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(Injections.GET_ME_USE_CASE)
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const userDto = request.body;
    const user = await this.createUserUseCase.execute(userDto);

    return response.status(HttpStatus.CREATED).json(user);
  }

  async getMe(request: Request, response: Response): Promise<Response> {
    const user = await this.getMeUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(user);
  }
}
