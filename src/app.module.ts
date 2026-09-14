import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { FileMetadataService } from './file-metadata/file-metadata.service';
import { HashService } from './hash/hash.service';
import { CategorizeService } from './categorize/categorize.service';

@Module({
  imports: [FilesModule],
  controllers: [AppController],
  providers: [AppService, FileMetadataService, HashService, CategorizeService],
})
export class AppModule { }
