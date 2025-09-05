import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Store } from '../entities/Store';

const router = Router();

// Mağaza oluştur
router.post('/', async (req: Request, res: Response) => {
  const { name, logoUrl, categoryId } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Mağaza adı gerekli.' });
    return;
  }
  if (!categoryId) {
    res.status(400).json({ message: 'Kategori gerekli.' });
    return;
  }
  try {
    const storeRepo = AppDataSource.getRepository(Store);
    const existing = await storeRepo.findOneBy({ name });
    if (existing) {
      res.status(400).json({ message: 'Bu mağaza zaten var.' });
      return;
    }
    const store = storeRepo.create({ name, logoUrl, categoryId: Number(categoryId) });
    await storeRepo.save(store);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Mağaza eklenemedi', error });
  }
});

// Tüm mağazaları listele
router.get('/', async (req: Request, res: Response) => {
  try {
    const storeRepo = AppDataSource.getRepository(Store);
    const stores = await storeRepo.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Mağazalar yüklenemedi', error });
  }
});

// Mağaza güncelle
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logoUrl, categoryId } = req.body;
  try {
    const storeRepo = AppDataSource.getRepository(Store);
    const store = await storeRepo.findOneBy({ id: Number(id) });
    if (!store) {
      res.status(404).json({ message: 'Mağaza bulunamadı.' });
      return;
    }
    store.name = name || store.name;
    store.logoUrl = logoUrl || store.logoUrl;
    if (categoryId) store.categoryId = Number(categoryId);
    await storeRepo.save(store);
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Mağaza güncellenemedi', error });
  }
});

// Mağaza sil
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const storeRepo = AppDataSource.getRepository(Store);
    const store = await storeRepo.findOneBy({ id: Number(id) });
    if (!store) {
      res.status(404).json({ message: 'Mağaza bulunamadı.' });
      return;
    }
    await storeRepo.remove(store);
    res.json({ message: 'Mağaza silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Mağaza silinemedi', error });
  }
});

export default router;