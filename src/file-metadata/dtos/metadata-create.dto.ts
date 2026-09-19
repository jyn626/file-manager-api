import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MetadataCreateDto {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  extension!: string;

  @Transform(({ value }) => parseInt(value)) // converts incoming string query/body parameter to an Integer
  @IsNumber()
  @IsNotEmpty()
  size!: number;

  @IsString()
  @IsNotEmpty()
  creationTime!: string;

  @IsString()
  mime!: string;
}
