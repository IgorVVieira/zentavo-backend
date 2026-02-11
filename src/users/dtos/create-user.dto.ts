import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsTaxId, MinLength } from 'class-validator';

const minLength = 6;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsTaxId()
  taxIdentifier: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber()
  cellphone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(minLength)
  @Expose()
  password: string;
}
