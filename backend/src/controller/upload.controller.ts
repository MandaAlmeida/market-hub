import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleGuard } from 'src/guards/roles.guard';
import { UploadService } from 'src/service/upload.service';

@Controller('uploads')
@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  /**
   * Upload de arquivo
   */
  @Post()
  @Roles('SELLER')
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
  async uploadFile(@UploadedFile() file: Express.Multer.File[]) {
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
   * Deletar arquivo
   */
  @Delete(':filename')
  @Roles('SELLER')
  async deleteFile(@Param('filename') filename: string) {
    return await this.uploadService.delete(filename);
  }
}
