import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Vercel'de /tmp kullan, local'de uploads kullan
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../../uploads');

// Upload dizinini oluştur
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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
    
    // Vercel'de farklı URL döndür
    const fileUrl = process.env.VERCEL 
      ? `/uploads/${file.filename}` 
      : `/uploads/${file.filename}`;
    
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken hata oluştu.' });
  }
});

export default router; 
 
 
 
 
 
 
 