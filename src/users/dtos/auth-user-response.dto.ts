import { IsString } from 'class-validator';

export class AuthUserResponseDto {
  @IsString()
  id: string;

  @IsString()
  token: string;
}
