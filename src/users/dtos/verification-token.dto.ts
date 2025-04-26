import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';

export class SendRecoveryPasswordTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ValidateTokenDto {
  @IsNotEmpty()
  token: string;

  @IsOptional()
  userId: string;

  @IsEnum(VerificationTokenType)
  @IsNotEmpty()
  type: VerificationTokenType;
}
