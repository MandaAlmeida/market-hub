import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from 'src/service/upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  /**
   * Upload de arquivo
   */
  @Post()
  @ApiOperation({ summary: 'Faz o upload de um arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.upload(file);
  }

  /**
   * Gerar URL pública para visualização
   */
  @Get(':filename')
  async getFileUrl(@Param('filename') filename: string) {
    return await this.uploadService.getFile(filename);
  }

  /**
   * Fazer download de arquivo via Stream
   */
  @Get('download/:url')
  async downloadFile(@Param('url') url: string, @Res() res: Response) {
    const result = await this.uploadService.download(url);
    return res.json(result); // <<< aqui está o problema resolvido
  }



  /**
   * Deletar arquivo
   */
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    return await this.uploadService.delete(filename);
  }
}
