import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
