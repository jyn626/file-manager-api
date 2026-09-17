// TODO: add validation `class-validator`
export class GetFilesQueryDto {
  filename?: string;
  category?: string;
  minSize?: number;
  maxSize?: number;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}