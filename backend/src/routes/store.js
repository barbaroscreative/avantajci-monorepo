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
const Store_1 = require("../entities/Store");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Mağaza oluştur
router.post('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, logoUrl, categoryId } = req.body;
    if (!name) {
        res.status(400).json({ message: 'Mağaza adı gerekli.' });
        return;
    }
    if (!categoryId) {
        res.status(400).json({ message: 'Kategori gerekli.' });
        return;
    }
    const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
    const existing = yield storeRepo.findOneBy({ name });
    if (existing) {
        res.status(400).json({ message: 'Bu mağaza zaten var.' });
        return;
    }
    const store = storeRepo.create({ name, logoUrl, categoryId: Number(categoryId) });
    yield storeRepo.save(store);
    res.status(201).json(store);
    return;
}));
// Tüm mağazaları listele
router.get('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
    const stores = yield storeRepo.find();
    res.json(stores);
    return;
}));
// Mağaza güncelle
router.put('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, logoUrl, categoryId } = req.body;
    const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
    const store = yield storeRepo.findOneBy({ id: Number(id) });
    if (!store) {
        res.status(404).json({ message: 'Mağaza bulunamadı.' });
        return;
    }
    store.name = name || store.name;
    store.logoUrl = logoUrl || store.logoUrl;
    if (categoryId)
        store.categoryId = Number(categoryId);
    yield storeRepo.save(store);
    res.json(store);
    return;
}));
// Mağaza sil
router.delete('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const storeRepo = data_source_1.AppDataSource.getRepository(Store_1.Store);
    const store = yield storeRepo.findOneBy({ id: Number(id) });
    if (!store) {
        res.status(404).json({ message: 'Mağaza bulunamadı.' });
        return;
    }
    yield storeRepo.remove(store);
    res.json({ message: 'Mağaza silindi.' });
    return;
}));
exports.default = router;
