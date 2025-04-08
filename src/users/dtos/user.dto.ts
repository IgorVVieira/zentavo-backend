import { CreateUserDto } from '@users/dtos/create-user.dto';

export type UserDto = Omit<CreateUserDto, 'password'> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
