import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async uploadFile(file) {
    return {
      data: {
        path: `${file.destination}${file.filename}`,
        filename: file.filename,
      },
    };
  }
}
