import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import crypto from 'crypto'
import fs from 'fs'
import { db } from 'src/db';
import { eq } from 'drizzle-orm';
import { files } from 'src/db/schema';

@Injectable()
export class HashService {

  getSHA256(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(filepath)
      // create readable filestream
      const fileStream = fs.createReadStream(filepath); // readable source
      // create sha-256 hash stream
      const hashStream = crypto.createHash('sha256'); // writable/transform

      fileStream.on('data', (chunk) => {
        hashStream.update(chunk);
      })

      fileStream.on('end', () => {
        resolve(hashStream.digest('hex'))
      })

      fileStream.on('error', (error) => {
        reject(error)
      })

    })
  }

  async getDuplicates(hash: string) {
    const _files = await db.select().from(files).where(eq(files.sha, hash));

    // for every duplicates (which is usually just 1), check if they still exists in the folder
    // if not, then send an error.
    // TODO: refactor
    await Promise.all(
      _files.map((file) => {
        if (!fs.existsSync(file.path)) {
          throw new HttpException('There was a problem in finding stored duplicates.', HttpStatus.BAD_REQUEST)
        }
      })
    )

    return _files;
    // return await db.select().from(files).where(eq(files.sha, hash))
  }
}
