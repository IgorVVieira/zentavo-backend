import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendRecoveryPasswordTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
