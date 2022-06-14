import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { of } from 'rxjs';

@Injectable()
export class ImageService {
  async getImage(res: Response, image) {
    if (image) {
      const imageInDirectory = join(
        process.cwd().concat('/storage/').concat(image),
      );
      return of(res.sendFile(join(imageInDirectory)));
    }

    throw new Error();
  }

  async getImages(album: string) {
    const data = fs
      .readdirSync(process.cwd().concat('/storage/').concat(album))
      .map((data) => `${process.env.HOST}/image/${data}`);

    return data;
  }

  async removeImagesWithDirectory(directory: string) {
    return fs.rmdirSync('./storage/'.concat(directory), { recursive: true });
  }

  async postImage(file: Array<Express.Multer.File>) {
    return;
  }
}
