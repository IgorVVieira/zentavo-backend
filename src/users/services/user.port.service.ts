import { UserDto } from '@users/dtos';

export interface IUserServicePort {
  validateUserExists(userId: string): Promise<void>;
  getUserById(userId: string): Promise<UserDto>;
}
