import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  @Expose()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsDate()
  @Expose()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @Expose()
  @IsNotEmpty()
  updatedAt: Date;
}

export class ActivateUserDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;
}
