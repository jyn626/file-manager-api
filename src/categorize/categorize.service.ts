import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { constants, access } from 'node:fs/promises';
import mime from 'mime-types'

@Injectable()
export class CategorizeService {
  // HTML -> text/html
  // CSS -> text/html
  // JavaScript -> text/javascript
  // PNG Image -> image/png
  // JPEG Image -> image/jpeg
  // JSON -> application/json
  // PDF -> application/pdf
  map = new Map([
    ['text/html', 'Others'],
    ['text/javascript', 'Others'],
    ['image/png', 'Image'],
    ['image/jpeg', 'Image'],
    ['application/json', 'Document'],
    ['application/pdf', 'Document'],
  ]);

  // maps extension/MIME to a category
  async getCategory(filepath: string) {
    try {
      await access(filepath, constants.F_OK) // test if the file exists (will throw an error if not) 
      const MIME = mime.lookup(filepath); // get MIME type

      let category = this.map[MIME]; // get the category base on the Map
      if (!category) { category = "Others" } // if it doesnt exists, then js set it as Others

      return category;
    } catch (error: any) {
      if (error.code == 'EONENT') {
        throw new HttpException('File not found.', HttpStatus.NOT_FOUND);
      }
    }
  }
}