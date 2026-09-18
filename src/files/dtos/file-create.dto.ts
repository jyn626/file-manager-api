import { IsNotEmpty, IsString } from 'class-validator';

export class FileCreateDto {
  @IsString()
  name!: string;

  @IsNotEmpty()
  path!: string;
}
