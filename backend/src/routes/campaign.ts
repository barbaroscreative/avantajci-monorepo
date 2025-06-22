import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Campaign } from '../entities/Campaign';
import { Store } from '../entities/Store';
import { Bank } from '../entities/Bank';
import { Category } from '../entities/Category';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { In } from 'typeorm';

const router = Router();

// MOBİL UYGULAMA İÇİN - JWT GEREKTİRMEYEN ENDPOINT'LER

// Mobil: Aktif kampanyaları listele (JWT gerektirmez)
router.get('/mobile', async (req, res): Promise<void> => {
  try {
    const campaignRepo = AppDataSource.getRepository(Campaign);
    const { store, bank, category } = req.query;

    let query = campaignRepo.createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.stores', 'store')
      .leftJoinAndSelect('campaign.bank', 'bank')
      .where('campaign.isActive = :isActive', { isActive: true });

    // Mağaza filtresi (SQLite için basit LIKE kullan)
    if (store) {
      query = query.andWhere('store.name LIKE :storeName', { storeName: `%${store}%` });
    }

    // Banka filtresi
    if (bank) {
      query = query.andWhere('bank.id = :bankId', { bankId: Number(bank) });
    }

    // Kategori filtresi
    if (category) {
      query = query.andWhere('campaign.category = :category', { category: category });
    }

    const campaigns = await query.getMany();
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching mobile campaigns:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Mobil: Tüm bankaları listele (JWT gerektirmez)
router.get('/mobile/banks', async (req, res): Promise<void> => {
  try {
    const bankRepo = AppDataSource.getRepository(Bank);
    const banks = await bankRepo.find();
    res.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Mobil: Tüm kategorileri listele (JWT gerektirmez)
router.get('/mobile/categories', async (req, res): Promise<void> => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    const categories = await categoryRepo.find({ order: { name: 'ASC' } });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Mobil: Mağaza arama (JWT gerektirmez)
router.get('/mobile/stores', async (req, res): Promise<void> => {
  try {
    const { search } = req.query;
    const storeRepo = AppDataSource.getRepository(Store);
    
    let query = storeRepo.createQueryBuilder('store');
    
    if (search) {
      query = query.where('LOWER(store.name) LIKE LOWER(:search)', { search: `%${search}%` });
    }
    
    const stores = await query.limit(10).getMany();
    res.json(stores);
  } catch (error) {
    console.error('Error searching stores:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// ADMIN PANELİ İÇİN - JWT GEREKTİREN ENDPOINT'LER

// Kampanya oluştur
router.post('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { title, description, startDate, endDate, category, storeIds, bankId, imageUrl, rewardAmount, rewardType } = req.body;
  if (!title || !description || !startDate || !endDate || !storeIds || !storeIds.length || !bankId) {
    res.status(400).json({ message: 'Zorunlu alanlar eksik.' }); return;
  }
  const storeRepo = AppDataSource.getRepository(Store);
  const bankRepo = AppDataSource.getRepository(Bank);
  
  const stores = await storeRepo.findBy({ id: In(storeIds.map(Number)) });
  const bank = await bankRepo.findOneBy({ id: Number(bankId) });
  
  if (stores.length !== storeIds.length || !bank) { 
    res.status(400).json({ message: 'Mağaza veya banka bulunamadı.' }); return; 
  }

  const campaignRepo = AppDataSource.getRepository(Campaign);
  const campaign = campaignRepo.create({
    title,
    description,
    startDate,
    endDate,
    category,
    stores,
    bank,
    imageUrl,
    rewardAmount,
    rewardType
  });
  await campaignRepo.save(campaign);
  res.status(201).json(campaign); return;
});

// Tüm kampanyaları listele
router.get('/', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const campaigns = await campaignRepo.find();

  const now = new Date();
  const campaignsToUpdate: Campaign[] = [];

  campaigns.forEach(campaign => {
    const endDate = new Date(campaign.endDate);
    if (campaign.isActive && now > endDate) {
      campaign.isActive = false;
      campaignsToUpdate.push(campaign);
    }
  });

  if (campaignsToUpdate.length > 0) {
    await campaignRepo.save(campaignsToUpdate);
  }

  res.json(campaigns); return;
});

// Kampanya aktif/pasif durumunu değiştir
router.patch('/:id/toggle', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const campaign = await campaignRepo.findOneBy({ id: Number(id) });

  if (!campaign) {
    res.status(404).json({ message: 'Kampanya bulunamadı.' });
    return;
  }

  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (now < startDate || now > endDate) {
    res.status(400).json({ message: 'Kampanya yayında olmadığı için durumu değiştirilemez.' });
    return;
  }

  campaign.isActive = !campaign.isActive;
  await campaignRepo.save(campaign);
  res.json(campaign);
});

// Kampanya güncelle
router.put('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const { title, description, startDate, endDate, category, storeIds, bankId, imageUrl, rewardAmount, rewardType } = req.body;
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const campaign = await campaignRepo.findOne({ where: { id: Number(id) }, relations: ['stores', 'bank'] });
  if (!campaign) { res.status(404).json({ message: 'Kampanya bulunamadı.' }); return; }
  
  if (storeIds && storeIds.length) {
    const stores = await AppDataSource.getRepository(Store).findBy({ id: In(storeIds.map(Number)) });
    if (stores.length !== storeIds.length) { res.status(400).json({ message: 'Mağaza bulunamadı.' }); return; }
    campaign.stores = stores;
  }
  
  if (bankId) {
    const bank = await AppDataSource.getRepository(Bank).findOneBy({ id: Number(bankId) });
    if (!bank) { res.status(400).json({ message: 'Banka bulunamadı.' }); return; }
    campaign.bank = bank;
  }

  campaign.title = title || campaign.title;
  campaign.description = description || campaign.description;
  campaign.startDate = startDate || campaign.startDate;
  campaign.endDate = endDate || campaign.endDate;
  campaign.category = category || campaign.category;
  campaign.imageUrl = imageUrl || campaign.imageUrl;
  campaign.rewardAmount = rewardAmount || campaign.rewardAmount;
  campaign.rewardType = rewardType || campaign.rewardType;
  
  await campaignRepo.save(campaign);
  res.json(campaign); return;
});

// Kampanya sil
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const campaign = await campaignRepo.findOneBy({ id: Number(id) });
  if (!campaign) { res.status(404).json({ message: 'Kampanya bulunamadı.' }); return; }
  await campaignRepo.remove(campaign);
  res.json({ message: 'Kampanya silindi.' }); return;
});

export default router; 
 
 
 
 
 