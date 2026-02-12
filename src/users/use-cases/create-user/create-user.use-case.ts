import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';
import { Injections } from '@shared/types/injections';

import { UserStatus } from '@users/domain/entities/user.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { CreateUserDto, UserDto } from '@users/dtos';
import { IEncryptPort } from '@users/ports/encypt.port';

@injectable()
export class CreateUserUseCase implements IBaseUseCase<CreateUserDto, UserDto> {
  constructor(
    @inject(Injections.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @inject(Injections.ENCRYPT_PORT)
    private readonly encrypter: IEncryptPort,
  ) {}

  async execute(createUserData: CreateUserDto): Promise<UserDto> {
    const { email, password, name, taxIdentifier, cellphone } = createUserData;
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new EntityAlreadyExistsError('User');
    }

    const encryptedPassword = await this.encrypter.encrypt(password);

    const userCreated = await this.userRepository.create({
      email,
      password: encryptedPassword,
      name,
      taxIdentifier,
      cellphone,
      status: UserStatus.ACTIVE,
    });

    return {
      id: userCreated.id as string,
      name: userCreated.name,
      email: userCreated.email,
      taxIdentifier: userCreated.taxIdentifier,
      cellphone: userCreated.cellphone,
      createdAt: userCreated.createdAt as Date,
      updatedAt: userCreated.updatedAt as Date,
    };
  }
}
