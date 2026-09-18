import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { statSync } from 'node:fs';
import { basename, extname } from 'node:path';
import { Mime } from 'mime';
import { fileMetadatas } from 'src/db/schema';
import { MetadataCreateDto } from './dtos/metadata-create.dto';
import { db } from 'src/db';

@Injectable()
export class FileMetadataService {
  // ! TODO: manually test later
  read(path: string): MetadataCreateDto {
    if (!path) {
      throw new HttpException('File path missing', HttpStatus.NOT_FOUND);
    }

    try {
      const stats = statSync(path);
      console.log('stats -- ', stats);
      const metadata: MetadataCreateDto = {
        filename: basename(path),
        extension: extname(path),
        size: stats.size,
        creationTime: stats.birthtime.toISOString(),
        mime: '',
      };

      return metadata;
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        // file permission denied error
        if (error.code == 'EACCES') {
          throw new HttpException(
            'File permission denied',
            HttpStatus.FORBIDDEN,
          );
          // file not found error
        } else if (error.code == 'ENOENT') {
          throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }
      }

      // TODO: fix this red squiggly line later
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async saveMetadata(metadata: MetadataCreateDto | null, filepath?: string) {
    if (!metadata && filepath) {
      metadata = this.read(filepath);
    }
    return await db.insert(fileMetadatas).values(metadata!);
  }
}
