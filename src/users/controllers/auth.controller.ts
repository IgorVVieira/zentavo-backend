/* eslint-disable @typescript-eslint/no-explicit-any */

import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { LoginDto } from '@users/dtos';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';

import { Response } from 'express';

@injectable()
@JsonController('/auth')
export class AuthController {
  constructor(
    @inject('LoginUseCase')
    private readonly loginUserCase: LoginUseCase,
  ) {
    this.login = this.login.bind(this);
  }

  @Post('/login')
  @OpenAPI({
    summary: 'Login user',
    description: 'Login user with email and password',
    responses: {
      '200': {
        description: 'User logged in successfully',
      },
      '401': {
        description: 'Unauthorized - Invalid credentials',
      },
    },
  })
  async login(@Body() loginDto: LoginDto, response: Response): Promise<any> {
    const { email, password } = loginDto;
    const token = await this.loginUserCase.execute({ email, password });

    return response.status(HttpStatus.OK).json(token);
  }
}
