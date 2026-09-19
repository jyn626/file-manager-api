import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { FileMetadataService } from './file-metadata/file-metadata.service';
import { HashService } from './hash/hash.service';
import { CategorizeService } from './categorize/categorize.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [FilesModule],
  controllers: [AppController],
  providers: [AppService, FileMetadataService, HashService, CategorizeService, UsersService, AuthService],
})
export class AppModule { }
