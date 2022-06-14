import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageController } from './api/image/image.controller';
import { ImageModule } from './api/image/image.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ImageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [AppController, ImageController],
  providers: [AppService],
})
export class AppModule {}
