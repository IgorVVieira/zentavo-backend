import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
