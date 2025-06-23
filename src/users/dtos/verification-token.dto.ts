import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';

export class SendRecoveryPasswordTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ValidateTokenDto {
  @IsNotEmpty()
  token: string;

  @IsEnum(VerificationTokenType)
  @IsNotEmpty()
  type: VerificationTokenType;
}

export class SendAccountVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  name: string;
}
