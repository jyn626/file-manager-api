import { IsNotEmpty, IsString } from 'class-validator'

export class CategoryOverrideDto {
  @IsNotEmpty()
  @IsString()
  category!: string;
}