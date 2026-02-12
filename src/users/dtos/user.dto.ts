import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsTaxId,
  IsUUID,
} from 'class-validator';

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

  @IsDate()
  @Expose()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @Expose()
  @IsNotEmpty()
  updatedAt: Date;
}
