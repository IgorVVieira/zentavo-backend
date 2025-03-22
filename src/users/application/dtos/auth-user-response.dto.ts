import { UserDto } from 'users/application/dtos/user.dto';

export class AuthUserResponseDto {
  user: UserDto;
  token: string;
}
