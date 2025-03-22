import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { CreateUserDto, UserDto } from '../../application/dtos';

export class UserController {
  constructor(private readonly createUserUseCase: IBaseUseCase<CreateUserDto, UserDto>) {}

  public async create(data: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(data);
  }
}
