import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { LoginUseCase } from '@users/use-cases/login/login.use-case';
import { SendRecoveryPasswordTokenUseCase } from '@users/use-cases/send-recovery-password-token/send-recovery-password.use-case';

import { Request, Response } from 'express';

@injectable()
export class AuthController {
  constructor(
    @inject(Injections.LOGIN_USE_CASE)
    private readonly loginUserCase: LoginUseCase,
    @inject(Injections.SEND_RECOVERY_PASSWORD_TOKEN_USE_CASE)
    private readonly sendRecoveryPasswordTokenUseCase: SendRecoveryPasswordTokenUseCase,
  ) {}

  // @OpenAPI({
  //   summary: 'Login user',
  //   description: 'Login user with email and password',
  //   responses: {
  //     '200': {
  //       description: 'User logged in successfully',
  //     },
  //     '401': {
  //       description: 'Unauthorized - Invalid credentials',
  //     },
  //   },
  // })
  // @ResponseSchema(AuthUserResponseDto)
  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user = await this.loginUserCase.execute({ email, password });

    return response.status(HttpStatus.OK).json(user);
  }

  // @OpenAPI({
  //   summary: 'Send recovery password token',
  //   description: 'Sends a recovery password token to the user email address',
  //   responses: {
  //     '200': {
  //       description: 'Recovery password token sent successfully',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid input data',
  //     },
  //     '404': {
  //       description: 'Not found - User not found',
  //     },
  //   },
  // })
  async sendRecoveryPasswordToken(request: Request, response: Response): Promise<Response> {
    await this.sendRecoveryPasswordTokenUseCase.execute(request.body);

    return response
      .status(HttpStatus.OK)
      .json({ message: 'Recovery password token sent successfully' });
  }
}
