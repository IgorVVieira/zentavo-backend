import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, Matches, MinLength } from 'class-validator';

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
  userId: string;

  @IsEnum(VerificationTokenType)
  @IsNotEmpty()
  type: VerificationTokenType;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsUUID()
  userId: string;

  /*eslint-disable @typescript-eslint/no-magic-numbers */
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  newPassword: string;
}
