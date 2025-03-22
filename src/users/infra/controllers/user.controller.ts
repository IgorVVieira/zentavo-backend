import { CreateUserDto } from 'users/application/dtos/create-user.dto';
import { UserDto } from 'users/application/dtos/user.dto';
import { IBaseUseCase } from 'users/core/use-cases/base.use-case';

export class UserController {
  constructor(private readonly createUserUseCase: IBaseUseCase<CreateUserDto, UserDto>) {}

  public async create(data: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(data);
  }
}
