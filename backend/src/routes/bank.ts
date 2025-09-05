import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Bank } from '../entities/Bank';

const router = Router();

// Banka oluştur
router.post('/', async (req: Request, res: Response) => {
  const { name, logoUrl } = req.body;
  if (!name) { res.status(400).json({ message: 'Banka adı gerekli.' }); return; }
  try {
    const bankRepo = AppDataSource.getRepository(Bank);
    const existing = await bankRepo.findOneBy({ name });
    if (existing) { res.status(400).json({ message: 'Bu banka zaten var.' }); return; }
    const bank = bankRepo.create({ name, logoUrl });
    await bankRepo.save(bank);
    res.status(201).json(bank);
  } catch (error) {
    res.status(500).json({ message: 'Banka eklenemedi', error });
  }
});

// Tüm bankaları listele
router.get('/', async (req: Request, res: Response) => {
  try {
    const bankRepo = AppDataSource.getRepository(Bank);
    const banks = await bankRepo.find();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: 'Bankalar yüklenemedi', error });
  }
});

// Banka güncelle
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logoUrl } = req.body;
  try {
    const bankRepo = AppDataSource.getRepository(Bank);
    const bank = await bankRepo.findOneBy({ id: Number(id) });
    if (!bank) { res.status(404).json({ message: 'Banka bulunamadı.' }); return; }
    bank.name = name || bank.name;
    bank.logoUrl = logoUrl || bank.logoUrl;
    await bankRepo.save(bank);
    res.json(bank);
  } catch (error) {
    res.status(500).json({ message: 'Banka güncellenemedi', error });
  }
});

// Banka sil
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bankRepo = AppDataSource.getRepository(Bank);
    const bank = await bankRepo.findOneBy({ id: Number(id) });
    if (!bank) { res.status(404).json({ message: 'Banka bulunamadı.' }); return; }
    await bankRepo.remove(bank);
    res.json({ message: 'Banka silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Banka silinemedi', error });
  }
});

export default router; 
 
 
 
 
 