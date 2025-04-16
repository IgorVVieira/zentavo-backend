import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';

import { UserStatus } from '@users/domain/entities/user.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { CreateUserDto, UserDto } from '@users/dtos';
import { IEncryptPort } from '@users/gateways/encypt.port';

@injectable()
export class CreateUserUseCase implements IBaseUseCase<CreateUserDto, UserDto> {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: IUserRepositoryPort,
    @inject('EncrypterAdapter')
    private readonly encrypter: IEncryptPort,
  ) {}

  async execute(createUserData: CreateUserDto): Promise<UserDto> {
    const { email, password, name } = createUserData;
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new EntityAlreadyExistsError('User');
    }

    const encryptedPassword = await this.encrypter.encrypt(password);

    const userCreated = await this.userRepository.create({
      email,
      password: encryptedPassword,
      name,
      status: UserStatus.PEDING_VERIFICATION,
    });

    return {
      id: userCreated.id as string,
      name: userCreated.name,
      email: userCreated.email,
      createdAt: userCreated.createdAt as Date,
      updatedAt: userCreated.updatedAt as Date,
    };
  }
}
