import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

const router = Router();

// Listele
router.get('/', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Category);
    const categories = await repo.find({ order: { name: 'ASC' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriler yüklenemedi', error });
  }
});

// Ekle
router.post('/', async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Kategori adı zorunlu' });
    return;
  }
  try {
    console.log('🔍 CATEGORY POST - Database URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
    console.log('🔍 CATEGORY POST - AppDataSource initialized:', AppDataSource.isInitialized);
    
    const repo = AppDataSource.getRepository(Category);
    const category = repo.create({ name });
    const savedCategory = await repo.save(category);
    
    console.log('✅ CATEGORY SAVED:', savedCategory);
    res.json(savedCategory);
  } catch (error) {
    console.error('❌ CATEGORY SAVE ERROR:', error);
    res.status(400).json({ message: 'Kategori eklenemedi', error });
  }
});

// Güncelle
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const repo = AppDataSource.getRepository(Category);
    const category = await repo.findOneBy({ id: Number(id) });
    if (!category) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }
    category.name = name;
    await repo.save(category);
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Kategori güncellenemedi', error });
  }
});

// Sil
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const repo = AppDataSource.getRepository(Category);
    const category = await repo.findOneBy({ id: Number(id) });
    if (!category) {
      res.status(404).json({ message: 'Kategori bulunamadı' });
      return;
    }
    await repo.remove(category);
    res.json({ message: 'Kategori silindi' });
  } catch (error) {
    res.status(400).json({ message: 'Kategori silinemedi', error });
  }
});

export default router; 