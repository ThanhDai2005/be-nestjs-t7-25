import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { object } from 'joi';
import { diskStorage } from 'multer';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@ApiTags('[Admins] Uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'assets/uploads',
        filename: (rea, file, callback) => {
          const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 10e9)}`;
          console.log('file', file);

          const [name, mineType] = file.originalname.split('.');
          const filename = `${name}_${uniqueSuffix}.${mineType}`;

          callback(null, filename);
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file) {
    return this.uploadService.uploadFile(file);
  }
}
