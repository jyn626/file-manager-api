import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { FileMetadataService } from './file-metadata/file-metadata.service';
import { HashService } from './hash/hash.service';
import { CategorizeService } from './categorize/categorize.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FilesModule, AuthModule],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, FileMetadataService, HashService, CategorizeService, UsersService, AuthService],
})
export class AppModule { }
