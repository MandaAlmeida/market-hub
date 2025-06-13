
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from 'src/controller/upload.controller';
import { Image } from 'src/entity/image.entity';
import { UploadService } from 'src/service/upload.service';
import { UserModule } from './user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule { }
