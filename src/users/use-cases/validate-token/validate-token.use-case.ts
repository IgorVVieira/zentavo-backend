import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';

import { IVerificationTokenRepositoryPort } from '@users/domain/repositories/verification-token.repository.port';
import { ValidateTokenDto } from '@users/dtos';

@injectable()
export class ValidateTokenUseCase implements IBaseUseCase<
  ValidateTokenDto,
  { isValid: boolean; userId?: string }
> {
  constructor(
    @inject(Injections.VERIFICATION_TOKEN_REPOSITORY)
    private readonly verificationTokenRepository: IVerificationTokenRepositoryPort,
  ) {}

  async execute(data: ValidateTokenDto): Promise<{ isValid: boolean; userId?: string }> {
    const verificationToken = await this.verificationTokenRepository.findByToken(data.token);

    const isInvalidToken =
      !verificationToken ||
      verificationToken.isUsed ||
      verificationToken.userId !== data.userId ||
      verificationToken.type !== data.type;

    if (isInvalidToken) {
      return { isValid: false };
    }

    const isExpired = verificationToken.expirationDate < new Date();

    if (isExpired) {
      // TODO: isso vai ser feito no job
      // await this.verificationTokenRepository.updateUsedStatus(verificationToken.id as string);

      return { isValid: false };
    }

    // TODO: invalidar o token na alteracao de senha
    // await this.verificationTokenRepository.updateUsedStatus(verificationToken.id as string);

    return { isValid: true, userId: verificationToken.userId };
  }
}
