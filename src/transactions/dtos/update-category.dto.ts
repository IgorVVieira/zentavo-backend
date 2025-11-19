import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
