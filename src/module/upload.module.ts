
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from 'src/controller/upload.controller';
import { UploadService } from 'src/service/upload.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule { }
