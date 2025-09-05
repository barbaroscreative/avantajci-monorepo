import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';

const router = Router();

// Her zaman memory storage kullan
const storage = multer.memoryStorage();

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
  console.log('🔍 Before multer - Content-Type:', req.headers['content-type']);
  console.log('🔍 Before multer - Content-Length:', req.headers['content-length']);
  
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.log('❌ Multer error:', err);
      (req as any).multerError = err;
      return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
    }
    console.log('✅ Multer success');
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
    
    // Her zaman base64 döndür
    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    res.json({ url: dataUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken hata oluştu.' });
  }
});

export default router; 
 
 
 
 
 
 
 