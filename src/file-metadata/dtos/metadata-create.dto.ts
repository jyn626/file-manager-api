import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class MetadataCreateDto {
  @IsString()
  filename!: string;

  @IsString()
  extension!: string;

  @Transform(({ value }) => parseInt(value)) // converts incoming string query/body parameter to an Integer
  @IsNumber()
  size!: number;

  @IsString()
  creationTime!: string;

  @IsString()
  mime!: string;
}
