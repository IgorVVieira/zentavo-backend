import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';

import { CreateUserDto } from 'users/application/dtos/create-user.dto';
import { UserDto } from 'users/application/dtos/user.dto';
import { IUserRepositoryPort } from 'users/domain/repositories/user.repository.interface';
import { IBaseUseCase } from 'users/domain/use-cases/base.use-case';

export class CreateUserUseCase implements IBaseUseCase<CreateUserDto, UserDto> {
  public constructor(private readonly userRepository: IUserRepositoryPort) {}

  public async execute(createUserData: CreateUserDto): Promise<UserDto> {
    const { email, password, name } = createUserData;
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new EntityAlreadyExistsError('User');
    }

    const userCreated = await this.userRepository.create({
      email,
      password,
      name,
    });

    return {
      ...userCreated,
      id: userCreated.id as string,
      createdAt: userCreated.createdAt as Date,
      updatedAt: userCreated.updatedAt as Date,
    };
  }
}
