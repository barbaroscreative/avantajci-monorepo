// @ts-nocheck
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

const router = Router();
const repo = AppDataSource.getRepository(Category);

// Listele
router.get('/', async (req: Request, res: Response) => {
  const categories = await repo.find({ order: { name: 'ASC' } });
  res.json(categories);
}) as any;

// Ekle
router.post('/', async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Kategori adı zorunlu' });
  try {
    const category = repo.create({ name });
    await repo.save(category);
    res.json(category);
  } catch (e) {
    res.status(400).json({ message: 'Kategori eklenemedi', error: e });
  }
}) as any;

// Güncelle
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await repo.findOneBy({ id: Number(id) });
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı' });
    category.name = name;
    await repo.save(category);
    res.json(category);
  } catch (e) {
    res.status(400).json({ message: 'Kategori güncellenemedi', error: e });
  }
}) as any;

// Sil
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await repo.findOneBy({ id: Number(id) });
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı' });
    await repo.remove(category);
    res.json({ message: 'Kategori silindi' });
  } catch (e) {
    res.status(400).json({ message: 'Kategori silinemedi', error: e });
  }
}) as any;

export default router; 