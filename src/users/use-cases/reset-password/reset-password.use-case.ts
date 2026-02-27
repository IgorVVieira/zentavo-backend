import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';
import { Injections } from '@shared/types/injections';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { IVerificationTokenRepositoryPort } from '@users/domain/repositories/verification-token.repository.port';
import { ResetPasswordDto } from '@users/dtos';
import { IEncryptPort } from '@users/ports/encypt.port';
import { ValidateTokenUseCase } from '@users/use-cases/validate-token/validate-token.use-case';

@injectable()
export class ResetPasswordUseCase implements IBaseUseCase<ResetPasswordDto, void> {
  /* eslint-disable max-params */
  constructor(
    @inject(Injections.VALIDATE_TOKEN_USE_CASE)
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    @inject(Injections.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @inject(Injections.VERIFICATION_TOKEN_REPOSITORY)
    private readonly verificationTokenRepository: IVerificationTokenRepositoryPort,
    @inject(Injections.ENCRYPT_PORT)
    private readonly encryptPort: IEncryptPort,
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const { isValid, tokenId } = await this.validateTokenUseCase.execute({
      token: data.token,
      userId: data.userId,
      type: VerificationTokenType.PASSWORD_RESET,
    });

    if (!isValid || !tokenId) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const hashedPassword = await this.encryptPort.encrypt(data.newPassword);

    await this.userRepository.update(data.userId, { password: hashedPassword });
    await this.verificationTokenRepository.updateUsedStatus(tokenId);
  }
}
