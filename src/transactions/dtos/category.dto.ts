import { CreateCategoryDto } from '@transactions/dtos/create-category.dto';

export class CategoryDto extends CreateCategoryDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
