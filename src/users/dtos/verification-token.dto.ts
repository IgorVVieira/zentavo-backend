import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';

export class SendRecoveryPasswordTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ValidateTokenDto {
  @IsNotEmpty()
  token: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(VerificationTokenType)
  @IsNotEmpty()
  type: VerificationTokenType;
}
