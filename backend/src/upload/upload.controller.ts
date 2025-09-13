import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { UploadService } from './upload.service';
import { ResponseUtil } from 'src/common/response/response.util';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', UploadController.getMulterOptions(new UploadService())),
  )
  uploadFile(@UploadedFile() file: MulterFile) {
    return ResponseUtil.success('File uploaded successfully',{
      filename: file.filename,
      path: file.path,
    })
  }

  // Factory function that calls service methods
  private static getMulterOptions(service: UploadService) {
    return {
      storage: service.getStorage('./temp-uploads'),
      fileFilter: service.imageFileFilter.bind(service),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    };
  }
}
