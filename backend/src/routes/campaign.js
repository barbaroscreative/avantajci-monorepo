"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Campaign_1 = require("../entities/Campaign");
const Store_1 = require("../entities/Store");
const Bank_1 = require("../entities/Bank");
const auth_1 = require("../middleware/auth");
const typeorm_1 = require("typeorm");
const router = (0, express_1.Router)();
// MOBİL UYGULAMA İÇİN - JWT GEREKTİRMEYEN ENDPOINT'LER
// Mobil: Aktif kampanyaları listele (JWT gerektirmez)
router.get('/mobile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
        const { store, bank } = req.query;
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
        const campaigns = yield query.getMany();
        res.json(campaigns);
    }
    catch (error) {
        console.error('Error fetching mobile campaigns:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
}));
// Mobil: Tüm bankaları listele (JWT gerektirmez)
router.get('/mobile/banks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
        const banks = yield bankRepo.find();
        res.json(banks);
    }
    catch (error) {
        console.error('Error fetching banks:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
}));
// Mobil: Mağaza arama (JWT gerektirmez)
router.get('/mobile/stores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
        let query = storeRepo.createQueryBuilder('store');
        if (search) {
            query = query.where('LOWER(store.name) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        const stores = yield query.limit(10).getMany();
        res.json(stores);
    }
    catch (error) {
        console.error('Error searching stores:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
}));
// ADMIN PANELİ İÇİN - JWT GEREKTİREN ENDPOINT'LER
// Kampanya oluştur
router.post('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, startDate, endDate, category, storeIds, bankId, imageUrl, rewardAmount, rewardType } = req.body;
    if (!title || !description || !startDate || !endDate || !storeIds || !storeIds.length || !bankId) {
        res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
        return;
    }
    const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
    const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
    const stores = yield storeRepo.findBy({ id: (0, typeorm_1.In)(storeIds.map(Number)) });
    const bank = yield bankRepo.findOneBy({ id: Number(bankId) });
    if (stores.length !== storeIds.length || !bank) {
        res.status(400).json({ message: 'Mağaza veya banka bulunamadı.' });
        return;
    }
    const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
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
    yield campaignRepo.save(campaign);
    res.status(201).json(campaign);
    return;
}));
// Tüm kampanyaları listele
router.get('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
    const campaigns = yield campaignRepo.find();
    const now = new Date();
    const campaignsToUpdate = [];
    campaigns.forEach(campaign => {
        const endDate = new Date(campaign.endDate);
        if (campaign.isActive && now > endDate) {
            campaign.isActive = false;
            campaignsToUpdate.push(campaign);
        }
    });
    if (campaignsToUpdate.length > 0) {
        yield campaignRepo.save(campaignsToUpdate);
    }
    res.json(campaigns);
    return;
}));
// Kampanya aktif/pasif durumunu değiştir
router.patch('/:id/toggle', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
    const campaign = yield campaignRepo.findOneBy({ id: Number(id) });
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
    yield campaignRepo.save(campaign);
    res.json(campaign);
}));
// Kampanya güncelle
router.put('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, startDate, endDate, category, storeIds, bankId, imageUrl, rewardAmount, rewardType } = req.body;
    const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
    const campaign = yield campaignRepo.findOne({ where: { id: Number(id) }, relations: ['stores', 'bank'] });
    if (!campaign) {
        res.status(404).json({ message: 'Kampanya bulunamadı.' });
        return;
    }
    if (storeIds && storeIds.length) {
        const stores = yield data_source_1.AppDataSource.getRepository(Store_1.Store).findBy({ id: (0, typeorm_1.In)(storeIds.map(Number)) });
        if (stores.length !== storeIds.length) {
            res.status(400).json({ message: 'Mağaza bulunamadı.' });
            return;
        }
        campaign.stores = stores;
    }
    if (bankId) {
        const bank = yield data_source_1.AppDataSource.getRepository(Bank_1.Bank).findOneBy({ id: Number(bankId) });
        if (!bank) {
            res.status(400).json({ message: 'Banka bulunamadı.' });
            return;
        }
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
    yield campaignRepo.save(campaign);
    res.json(campaign);
    return;
}));
// Kampanya sil
router.delete('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const campaignRepo = data_source_1.AppDataSource.getRepository(Campaign_1.Campaign);
    const campaign = yield campaignRepo.findOneBy({ id: Number(id) });
    if (!campaign) {
        res.status(404).json({ message: 'Kampanya bulunamadı.' });
        return;
    }
    yield campaignRepo.remove(campaign);
    res.json({ message: 'Kampanya silindi.' });
    return;
}));
exports.default = router;
