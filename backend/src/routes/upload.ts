import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Vercel'de memory storage, local'de disk storage
const storage = process.env.VERCEL 
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    });

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'Dosya yüklenemedi.' });
      return;
    }
    
    if (process.env.VERCEL) {
      // Vercel'de base64 döndür
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
      res.json({ url: dataUrl });
    } else {
      // Local'de dosya yolu döndür
      const fileUrl = `/uploads/${file.filename}`;
      res.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken hata oluştu.' });
  }
});

export default router; 
 
 
 
 
 
 
 