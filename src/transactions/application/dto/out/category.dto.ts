import { CreateCategoryDto } from '@transactions/application/dto/in/create-category.dto';

export class CategoryDto extends CreateCategoryDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
