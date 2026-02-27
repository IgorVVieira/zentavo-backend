import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { LoginUseCase } from '@users/use-cases/login/login.use-case';
import { ResetPasswordUseCase } from '@users/use-cases/reset-password/reset-password.use-case';
import { SendRecoveryPasswordTokenUseCase } from '@users/use-cases/send-recovery-password-token/send-recovery-password.use-case';
import { ValidateTokenUseCase } from '@users/use-cases/validate-token/validate-token.use-case';

import { Request, Response } from 'express';

@injectable()
export class AuthController {
  /* eslint-disable max-params */
  constructor(
    @inject(Injections.LOGIN_USE_CASE)
    private readonly loginUserCase: LoginUseCase,
    @inject(Injections.SEND_RECOVERY_PASSWORD_TOKEN_USE_CASE)
    private readonly sendRecoveryPasswordTokenUseCase: SendRecoveryPasswordTokenUseCase,
    @inject(Injections.VALIDATE_TOKEN_USE_CASE)
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    @inject(Injections.RESET_PASSWORD_USE_CASE)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user = await this.loginUserCase.execute({ email, password });

    return response.status(HttpStatus.OK).json(user);
  }

  async sendRecoveryPasswordToken(request: Request, response: Response): Promise<Response> {
    await this.sendRecoveryPasswordTokenUseCase.execute(request.body);

    return response
      .status(HttpStatus.OK)
      .json({ message: 'Recovery password token sent successfully' });
  }

  async validateToken(request: Request, response: Response): Promise<Response> {
    const data = await this.validateTokenUseCase.execute(request.body);

    return response.status(HttpStatus.OK).json(data);
  }

  async resetPassword(request: Request, response: Response): Promise<Response> {
    await this.resetPasswordUseCase.execute(request.body);

    return response.status(HttpStatus.OK).json({ message: 'Password reset successfully' });
  }
}
