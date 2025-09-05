import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';

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
    console.log('🔍 File filter check:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname
    });
    
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File type accepted');
      cb(null, true);
    } else {
      console.log('❌ File type rejected:', file.mimetype);
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

// Multer error handler
const uploadWithErrorHandling = (req: Request, res: Response, next: any) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.log('❌ Multer error:', err);
      (req as any).multerError = err;
    }
    next();
  });
};

router.post('/', uploadWithErrorHandling, async (req: Request, res: Response) => {
  try {
    console.log('=== UPLOAD REQUEST START ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request files:', req.files);
    console.log('Multer error:', (req as any).multerError);
    console.log('Environment VERCEL:', process.env.VERCEL);
    console.log('=== UPLOAD REQUEST END ===');
    
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      console.log('❌ No file received - returning 400');
      res.status(400).json({ message: 'Dosya yüklenemedi.' });
      return;
    }
    
    console.log('✅ File received:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? 'Buffer exists' : 'No buffer'
    });
    
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
 
 
 
 
 
 
 