// TODO: add validation `class-validator`
export class GetFilesQueryDto {
  filename?: string;
  category?: 'Document' | 'Image' | 'Video' | 'Audio' | 'Others';
  minSize?: number;
  maxSize?: number;
  sortBy?: string;
  extension?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}