import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db';
import { eq } from 'drizzle-orm';
import { fileMetadatas, files } from 'src/db/schema';
import Fs from 'node:fs/promises'

@Injectable()
export class FilesService {
  // private files = [
  //   { id: 1, name: "photo.jpg", path: "/images/photo.jpg" },
  //   { id: 2, name: "song.mp3", path: "/music/song.mp3" },
  //   { id: 3, name: "document.pdf", path: "/docs/document.pdf" },
  //   { id: 4, name: "fIeYumGSYp4MQlIlU.gif", path: "test-files/fIeYumGSYp4MQlIlU.gif" }
  // ]

  async findAll(limit?: number, offset?: number) {
    // with simple pagination
    // return (
    //   limit && limit > 0 &&
    //   offset && offset > 0) ?
    //   this.files.slice(offset, limit) : this.files;

    return await db.query.files.findMany({
      offset,
      limit
    })
  }

  async findOne(id: number) {
    // const matched = this.files.find((file) => file.id === id);

    // if (!matched) {
    //   throw new NotFoundException();
    //   // throw new HttpException('File not found.', HttpStatus.NOT_FOUND);
    // }

    // return matched;
    const matched = await db.query.files.findFirst({
      where: eq(files.id, id)
    });

    if (!matched) {
      throw new NotFoundException();
    }

    return matched;
  }

  async findByExtension(extension: string) {
    return await db.query.fileMetadatas.findMany({
      with: {
        files: true
      },
      where: eq(fileMetadatas.extension, extension)
    })
  }

  async upload(
    name: string,
    path: string
  ) {
    try {
      const file: typeof files.$inferInsert = {
        name,
        path,
        category: 'Others'
      };
      const storedFile = await db.insert(files).values(file);
      return storedFile[0].id;
    } catch (error) {
      // TODO: when the db failed, delete the file in the disk
      await Fs.rm(path, { force: true });

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
    return await db.update(files).set({ sha: hash }).where(eq(files.id, id))
  }
}