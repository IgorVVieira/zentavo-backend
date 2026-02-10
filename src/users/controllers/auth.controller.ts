import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { LoginUseCase } from '@users/use-cases/login/login.use-case';
import { SendRecoveryPasswordTokenUseCase } from '@users/use-cases/send-recovery-password-token/send-recovery-password.use-case';

import { CheckSubscriptionUseCase } from '@payments/use-cases/check-subscrition.use-case';
import { Request, Response } from 'express';

@injectable()
export class AuthController {
  constructor(
    @inject(Injections.LOGIN_USE_CASE)
    private readonly loginUserCase: LoginUseCase,
    @inject(Injections.SEND_RECOVERY_PASSWORD_TOKEN_USE_CASE)
    private readonly sendRecoveryPasswordTokenUseCase: SendRecoveryPasswordTokenUseCase,
    @inject(Injections.CHECK_SUBSCRIPTION_USE_CASE)
    private readonly checkSubscriptionUseCase: CheckSubscriptionUseCase,
  ) {}

  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user = await this.loginUserCase.execute({ email, password });

    await this.checkSubscriptionUseCase.execute(user.id);

    return response.status(HttpStatus.OK).json(user);
  }

  async sendRecoveryPasswordToken(request: Request, response: Response): Promise<Response> {
    await this.sendRecoveryPasswordTokenUseCase.execute(request.body);

    return response
      .status(HttpStatus.OK)
      .json({ message: 'Recovery password token sent successfully' });
  }
}
