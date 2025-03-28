/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { HttpStatus } from '@shared/http-status.enum';

import { CreateUserDto, UserDto } from '../../application/dtos';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserUseCase')
    private createUserUseCase: IBaseUseCase<CreateUserDto, UserDto>,
  ) {}

  public async create(request: Request, response: Response): Promise<any> {
    const user = await this.createUserUseCase.execute(request.body);

    return response.status(HttpStatus.CREATED).json(user);
  }
}
