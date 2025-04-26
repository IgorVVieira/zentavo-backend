import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { AuthUserResponseDto, LoginDto } from '@users/dtos';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';
import { SendRecoveryPasswordTokenUseCase } from '@users/use-cases/send-recovery-password-token/send-recovery-password.use-case';

@injectable()
@JsonController('/auth')
export class AuthController {
  constructor(
    @inject('LoginUseCase')
    private readonly loginUserCase: LoginUseCase,
    @inject('SendRecoveryPasswordTokenUseCase')
    private readonly sendRecoveryPasswordTokenUseCase: SendRecoveryPasswordTokenUseCase,
  ) {}

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

  @Post('/forgot-password')
  @OpenAPI({
    summary: 'Send recovery password token',
    description: 'Sends a recovery password token to the user email address',
    responses: {
      '200': {
        description: 'Recovery password token sent successfully',
      },
      '400': {
        description: 'Bad request - Invalid input data',
      },
      '404': {
        description: 'Not found - User not found',
      },
    },
  })
  async sendRecoveryPasswordToken(
    @Body() { email }: { email: string },
  ): Promise<{ message: string }> {
    await this.sendRecoveryPasswordTokenUseCase.execute({ email });

    return {
      message: 'Recovery password token sent successfully',
    };
  }
}
