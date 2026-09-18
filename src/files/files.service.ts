import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from 'src/db';
import { desc, eq, sql } from 'drizzle-orm';
import { fileMetadatas, files } from 'src/db/schema';
import Fs from 'node:fs/promises';
import { GetFilesQueryDto } from './dtos/get-files-query.dto';
import path from 'node:path';

@Injectable()
export class FilesService {
  // private files = [
  //   { id: 1, name: "photo.jpg", path: "/images/photo.jpg" },
  //   { id: 2, name: "song.mp3", path: "/music/song.mp3" },
  //   { id: 3, name: "document.pdf", path: "/docs/document.pdf" },
  //   { id: 4, name: "fIeYumGSYp4MQlIlU.gif", path: "test-files/fIeYumGSYp4MQlIlU.gif" }
  // ]

  async findAll(queries: GetFilesQueryDto) {
    // with simple pagination
    // return (
    //   limit && limit > 0 &&
    //   offset && offset > 0) ?
    //   this.files.slice(offset, limit) : this.files;

    if (queries.filename) {
      return await this.findByFilename(queries.filename);
    }

    // ! TODO: add filtering for min size and max size
    return await db.query.files.findMany({
      where: queries.category
        ? eq(files.category, queries.category)
        : undefined,
      offset: queries.offset,
      limit: queries.limit,
    });
  }

  async findOne(id: number) {
    // const matched = this.files.find((file) => file.id === id);

    // if (!matched) {
    //   throw new NotFoundException();
    //   // throw new HttpException('File not found.', HttpStatus.NOT_FOUND);
    // }

    // return matched;
    const matched = await db.query.files.findFirst({
      where: eq(files.id, id),
    });

    if (!matched) {
      throw new NotFoundException();
    }

    return matched;
  }

  async findByFilename(filename: string) {
    return await db.query.files.findFirst({
      where: eq(files.name, filename),
    });
  }

  async findByCategory(
    category: 'Document' | 'Image' | 'Video' | 'Audio' | 'Others',
  ) {
    return await db.query.files.findMany({
      where: eq(files.category, category),
    });
  }

  async findByExtension(extension: string) {
    return await db.query.fileMetadatas.findMany({
      with: {
        files: true,
      },
      where: eq(fileMetadatas.extension, extension),
    });
  }

  async upload(name: string, fpath: string) {
    try {
      const ext = path.extname(name);
      const file: typeof files.$inferInsert = {
        name,
        path: fpath,
        extension: ext,
        category: 'Others',
      };
      const [storedFile] = await db.insert(files).values(file).returning();
      return storedFile.id;
    } catch (error) {
      // TODO: when the db failed, delete the file in the disk
      await Fs.rm(fpath, { force: true });

      throw error;
    }
  }

  async delete(id: number) {
    // this.findOne(id); // check if the file exists first
    // return this.files.filter((file) => file.id !== id);
    return await db.delete(files).where(eq(files.id, id));
  }

  async deleteFromDisks(path: string) {
    return await Fs.rm(path, { force: true });
  }

  async saveHash(id: number, hash: string) {
    return await db.update(files).set({ sha: hash }).where(eq(files.id, id));
  }

  async clear() {
    try {
      // TODO: add authorization (?)
      // clear all the file records in the database
      // await Fs.rmdir('./uploads', { recursive: true }); // this removes the whole folder and its contents

      const files = await Fs.readdir('./uploads');
      // const deletePromises = files.map((file) => {
      //   const fpath = path.join('./uploads', file);

      //   return Fs.unlink(fpath); // unlink -- removes a file from the file system
      // })

      // Promise.all(deletePromises);
      // Promise.all -> execute multiple promises in parallel, and wait for all of them to succeed before proceeding
      return await Promise.all(
        files.map((file) => {
          const fpath = path.join('./uploads', file);

          return Fs.unlink(fpath); // unlink -- removes a file from the file system
        }),
      );
      // return await db.delete(files);
      // return await db.e  xecute(sql`TRUNCATE TABLE files CASCADE`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
