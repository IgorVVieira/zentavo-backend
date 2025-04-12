import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

import { CreateCategoryDto } from '@transactions/dtos/create-category.dto';

export class CategoryDto extends CreateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
