import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';

import { CreateUserDto, UserDto } from '../../application/dtos';
import { IUserRepositoryPort } from '../domain/repositories/user.repository.port';
import { IEncryptPort } from '../gateways/encypt.port';

export class CreateUserUseCase implements IBaseUseCase<CreateUserDto, UserDto> {
  public constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly encrypter: IEncryptPort,
  ) {}

  public async execute(createUserData: CreateUserDto): Promise<UserDto> {
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
