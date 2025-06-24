import { inject, injectable } from 'tsyringe';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';
import { ActivateUserDto, CreateUserDto, UserDto } from '@users/dtos';
import { ActivateUserUseCase } from '@users/use-cases/activate-user/activate-user.use-case';
import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { SendAccountVerificationEmailUseCase } from '@users/use-cases/send-account-verification-email/send-account-verification-email.use-case';
import { ValidateTokenUseCase } from '@users/use-cases/validate-token/validate-token.use-case';

@injectable()
export class UserService {
  /*eslint-disable-next-line max-params */
  constructor(
    @inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
    @inject('SendAccountVerificationEmailUseCase')
    private readonly sendAccountVerificationEmailUseCase: SendAccountVerificationEmailUseCase,
    @inject('ValidateTokenUseCase')
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    @inject('ActivateUserUseCase')
    private readonly activateUserUseCase: ActivateUserUseCase,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.createUserUseCase.execute(createUserDto);

    await this.sendAccountVerificationEmailUseCase.execute({
      userId: user.id as string,
      email: createUserDto.email,
      name: createUserDto.name,
    });

    return user;
  }

  async activateUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { isValid, userId } = await this.validateTokenUseCase.execute({
      token: activateUserDto.token,
      userId: activateUserDto.userId,
      type: VerificationTokenType.ACCOUNT_VERIFICATION,
    });

    if (!isValid && !userId) {
      throw new Error('Invalid token');
    }

    await this.activateUserUseCase.execute(userId as string);

    // TODO: Queimar token
  }
}
