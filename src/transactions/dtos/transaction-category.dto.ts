import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TransactionCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
