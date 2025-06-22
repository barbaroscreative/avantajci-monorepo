import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Store } from '../entities/Store';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// Mağaza oluştur
router.post('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { name, logoUrl, categoryId } = req.body;
  if (!name) { res.status(400).json({ message: 'Mağaza adı gerekli.' }); return; }
  if (!categoryId) { res.status(400).json({ message: 'Kategori gerekli.' }); return; }
  const storeRepo = AppDataSource.getRepository(Store);
  const existing = await storeRepo.findOneBy({ name });
  if (existing) { res.status(400).json({ message: 'Bu mağaza zaten var.' }); return; }
  const store = storeRepo.create({ name, logoUrl, categoryId: Number(categoryId) });
  await storeRepo.save(store);
  res.status(201).json(store); return;
});

// Tüm mağazaları listele
router.get('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const storeRepo = AppDataSource.getRepository(Store);
  const stores = await storeRepo.find();
  res.json(stores); return;
});

// Mağaza güncelle
router.put('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const { name, logoUrl, categoryId } = req.body;
  const storeRepo = AppDataSource.getRepository(Store);
  const store = await storeRepo.findOneBy({ id: Number(id) });
  if (!store) { res.status(404).json({ message: 'Mağaza bulunamadı.' }); return; }
  store.name = name || store.name;
  store.logoUrl = logoUrl || store.logoUrl;
  if (categoryId) store.categoryId = Number(categoryId);
  await storeRepo.save(store);
  res.json(store); return;
});

// Mağaza sil
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const storeRepo = AppDataSource.getRepository(Store);
  const store = await storeRepo.findOneBy({ id: Number(id) });
  if (!store) { res.status(404).json({ message: 'Mağaza bulunamadı.' }); return; }
  await storeRepo.remove(store);
  res.json({ message: 'Mağaza silindi.' }); return;
});

export default router; 
 
 
 
 