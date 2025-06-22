import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req: Request, res: Response): void => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ message: 'Dosya yüklenemedi.' }); return;
  }
  const fileUrl = `/uploads/${file.filename}`;
  res.json({ url: fileUrl }); return;
});

export default router; 
 
 
 
 
 