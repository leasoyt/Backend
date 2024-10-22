import { Injectable } from '@nestjs/common';
import cloudinary from '../config/cloudinary.config';

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'RestO' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); // Devuelve la URL segura del archivo subido
          }
        },
      );

      // Envía el buffer del archivo para que se suba
      stream.end(file.buffer);
    });
  }
}
