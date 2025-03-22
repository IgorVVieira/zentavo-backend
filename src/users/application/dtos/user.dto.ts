import { CreateUserDto } from 'users/application/dtos/create-user.dto';

export class UserDto extends CreateUserDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
