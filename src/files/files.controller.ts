import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  HttpException
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileMetadataService } from 'src/file-metadata/file-metadata.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HashService } from 'src/hash/hash.service';
import Fs, { access, constants } from 'node:fs/promises'
import { DrizzleError } from 'drizzle-orm';

@Controller('files')
export class FilesController {
  constructor(
    private fileService: FilesService,
    private fileMetadataService: FileMetadataService,
    private hashService: HashService
  ) { }

  @Get('/test')
  test() {
    return 'hello'
  }

  // GET /files
  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number) {

    return await this.fileService.findAll(limit, offset);
  }

  // GET /files/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.findOne(id);
  }

  // GET /files/:extension
  @Get(':extension')
  findByExtension(@Param("extension") extension: string) {
  }


  // POST /files
  @UseInterceptors(
    FileInterceptor('file', { // FileInterceptor('file') handles the multipart field
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

          cb(null, filename);
        }
      })
    })
  )
  @Post()
  async upload(@UploadedFile('file') file: Express.Multer.File) { // and @UploadedFile() retrieves the resulting file object
    try {
      // temporarily store the file and see if there's any duplicate
      await this.fileService.upload(file.originalname, file.path);

      // before proceeding to hash, make sure the file is saved in the disk
      await access(file.path, constants.F_OK)

      // after the file upload is complete, compute hash and check if it already exists
      const newFileHash = await this.hashService.getSHA256(file.path);
      const exists = await this.hashService.getDuplicates(newFileHash as string);

      console.log('-- exists: ', exists.length);

      // reject duplicates
      if (exists.length > 0) {
        // delete file from disk
        await Fs.rm(file.path, { force: true });
        // send error
        throw new HttpException('File already exists, duplicates are not supported.', HttpStatus.CONFLICT)
      }

      // if theyre arent duplicates then store the file.
      return {
        message: 'Upload successfull.',
        filepath: file.path
      }
    } catch (error: any) {
      // ! TODO: confirm this is working.
      console.log(error)
      if (error.code == 'ENOENT') {
        throw new HttpException('File not found.', HttpStatus.NOT_FOUND);
      }
      // // handle error where the DB failed
      // if (error instanceof DrizzleError) {
      //   // if the DB failed, then delete the file.
      //   await Fs.rm(file.path, { force: true });
      // }
    }
  }

  // DELETE /files/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.delete(id);
  }

  // POST /files/:id/analyze
  @Get(':id/analyze')
  async analyze(@Param('id', ParseIntPipe) id: number) {
    const file = await this.findOne(id);

    return this.fileMetadataService.read(file.path);
  }

  // POST /files/:id/hash
  @Post(':id/hash')
  async storeHash(@Param('id') id: number) {
    const file = await this.findOne(id);
    const hash = await this.hashService.getSHA256(file.path);
    await this.fileService.saveHash(id, hash as string);
    return {
      message: 'Hash successfull.',
      hash,
    };
  }
}
