import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage yapılandırması
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avantajci',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  },
});

const router = Router();

// Görsel yükleme endpoint'i
router.post('/', upload.single('file'), (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    
    if (!file) {
      return res.status(400).json({ message: 'Dosya yüklenemedi.' });
    }

    // Cloudinary'den dönen URL'i kullan
    const fileUrl = file.path;
    
    res.json({ 
      url: fileUrl,
      public_id: file.filename,
      secure_url: fileUrl
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken hata oluştu.', error: error.message });
  }
});

// Görsel silme endpoint'i
router.delete('/:public_id', async (req: Request, res: Response) => {
  try {
    const { public_id } = req.params;
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({ message: 'Görsel başarıyla silindi.' });
    } else {
      res.status(404).json({ message: 'Görsel bulunamadı.' });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ message: 'Görsel silinirken hata oluştu.', error: error.message });
  }
});

export default router;
