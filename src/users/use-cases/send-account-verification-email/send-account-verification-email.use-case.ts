import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { IEmailProviderPort } from '@shared/gateways/email-provider.port';
import { generateSixDigitToken } from '@shared/utils/generate-random-token';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';
import { IVerificationTokenRepositoryPort } from '@users/domain/repositories/verification-token.repository.port';
import { SendAccountVerificationEmailDto } from '@users/dtos';

@injectable()
export class SendAccountVerificationEmailUseCase
  implements IBaseUseCase<SendAccountVerificationEmailDto, void>
{
  constructor(
    @inject('verificationTokenRepository')
    private readonly verificationTokenRepository: IVerificationTokenRepositoryPort,
    @inject('EmailProvider')
    private readonly emailProvider: IEmailProviderPort,
  ) {}

  async execute(data: SendAccountVerificationEmailDto): Promise<void> {
    const { userId, email, name } = data;
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
    const oneHourExpirationDate = new Date(Date.now() + 1000 * 60 * 60);

    const verificationToken = await this.verificationTokenRepository.create({
      userId,
      expirationDate: oneHourExpirationDate,
      isUsed: false,
      type: VerificationTokenType.ACCOUNT_VERIFICATION,
      token: generateSixDigitToken(),
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-account/token=${verificationToken.token}`;

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Verificação de conta Zentavo',
      body: `
        <h1>Verificação de conta</h1>
        <p>Olá ${name},</p>
        <p>Obrigado por criar uma conta na Zentavo! Para ativar sua conta, clique no link abaixo:</p>
        <a href="${verificationUrl}">Verificar conta</a>
        <p>Se você não se inscreveu, ignore este e-mail.</p>
        <p>Atenciosamente,</p>
        <p>Zentavo Team</p>
      `,
    });
  }
}
