import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { AuthUserResponseDto, LoginDto } from '@users/dtos';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';

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
  @ResponseSchema(AuthUserResponseDto)
  async login(@Body() loginDto: LoginDto): Promise<AuthUserResponseDto> {
    const { email, password } = loginDto;

    return this.loginUserCase.execute({ email, password });
  }
}
