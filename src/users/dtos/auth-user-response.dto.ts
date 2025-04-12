import { IsString } from 'class-validator';

export class AuthUserResponseDto {
  @IsString()
  token: string;
}
