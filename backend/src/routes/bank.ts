import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Bank } from '../entities/Bank';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// Banka oluştur
router.post('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { name, logoUrl } = req.body;
  if (!name) { res.status(400).json({ message: 'Banka adı gerekli.' }); return; }
  const bankRepo = AppDataSource.getRepository(Bank);
  const existing = await bankRepo.findOneBy({ name });
  if (existing) { res.status(400).json({ message: 'Bu banka zaten var.' }); return; }
  const bank = bankRepo.create({ name, logoUrl });
  await bankRepo.save(bank);
  res.status(201).json(bank); return;
});

// Tüm bankaları listele
router.get('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const bankRepo = AppDataSource.getRepository(Bank);
  const banks = await bankRepo.find();
  res.json(banks); return;
});

// Banka güncelle
router.put('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const { name, logoUrl } = req.body;
  const bankRepo = AppDataSource.getRepository(Bank);
  const bank = await bankRepo.findOneBy({ id: Number(id) });
  if (!bank) { res.status(404).json({ message: 'Banka bulunamadı.' }); return; }
  bank.name = name || bank.name;
  bank.logoUrl = logoUrl || bank.logoUrl;
  await bankRepo.save(bank);
  res.json(bank); return;
});

// Banka sil
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const bankRepo = AppDataSource.getRepository(Bank);
  const bank = await bankRepo.findOneBy({ id: Number(id) });
  if (!bank) { res.status(404).json({ message: 'Banka bulunamadı.' }); return; }
  await bankRepo.remove(bank);
  res.json({ message: 'Banka silindi.' }); return;
});

export default router; 
 
 
 
 