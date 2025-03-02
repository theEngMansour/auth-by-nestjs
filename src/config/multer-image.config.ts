import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerImageConfig = {
  storage: diskStorage({
    destination: './files',
    filename: (req, file, cb) => {
      const prefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${prefix}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (
    req: any,
    file: { mimetype: string },
    cb: (arg0: BadRequestException | null, arg1: boolean) => void,
  ) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only JPEG images are allowed'), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 },
};
