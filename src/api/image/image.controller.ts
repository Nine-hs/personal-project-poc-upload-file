import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { diskStorage, DiskStorageOptions } from 'multer';
import * as fs from 'fs';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get('/:image')
  async getImageHandler(
    @Param() params: { image: string },
    @Res() res: Response,
  ) {
    try {
      const { image } = params;
      return this.imageService.getImage(res, image);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('album/images')
  async getImagesHandler(@Query() query: { album: string }) {
    try {
      const { album } = query;
      return this.imageService.getImages(album);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './storage/',
        async filename(req, file, cb) {
          if (
            !['image/jpeg', 'image/webp', 'image/png'].includes(file.mimetype)
          ) {
            return cb(null, null);
          }

          const rootPath = './storage/';
          const makeDirectory =
            req.query.user_id && req.query.album
              ? `${req.query.user_id}/${req.query.album}/`
              : req.query.album
              ? `${req.query.album}/`
              : '';

          const isExistDirectory = fs.existsSync(
            rootPath.concat(makeDirectory),
          );
          if (!isExistDirectory) {
            await fs.promises.mkdir(rootPath.concat(makeDirectory), {
              recursive: true,
            });
          }

          cb(null, makeDirectory.concat(file.originalname));
        },
      }),
    }),
  )
  async postImageHandler(
    @UploadedFile() file: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log(JSON.parse(body.data));

    return this.imageService.postImage(file);
  }

  @Delete()
  async removeImagesWithDirectory(@Query() query: { directory: string }) {
    const { directory } = query;
    console.log(directory);

    return this.imageService.removeImagesWithDirectory(directory);
  }
}
