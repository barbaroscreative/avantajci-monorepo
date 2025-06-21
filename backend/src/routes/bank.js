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
const Bank_1 = require("../entities/Bank");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Banka oluştur
router.post('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, logoUrl } = req.body;
    if (!name) {
        res.status(400).json({ message: 'Banka adı gerekli.' });
        return;
    }
    const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
    const existing = yield bankRepo.findOneBy({ name });
    if (existing) {
        res.status(400).json({ message: 'Bu banka zaten var.' });
        return;
    }
    const bank = bankRepo.create({ name, logoUrl });
    yield bankRepo.save(bank);
    res.status(201).json(bank);
    return;
}));
// Tüm bankaları listele
router.get('/', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
    const banks = yield bankRepo.find();
    res.json(banks);
    return;
}));
// Banka güncelle
router.put('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, logoUrl } = req.body;
    const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
    const bank = yield bankRepo.findOneBy({ id: Number(id) });
    if (!bank) {
        res.status(404).json({ message: 'Banka bulunamadı.' });
        return;
    }
    bank.name = name || bank.name;
    bank.logoUrl = logoUrl || bank.logoUrl;
    yield bankRepo.save(bank);
    res.json(bank);
    return;
}));
// Banka sil
router.delete('/:id', auth_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bankRepo = data_source_1.AppDataSource.getRepository(Bank_1.Bank);
    const bank = yield bankRepo.findOneBy({ id: Number(id) });
    if (!bank) {
        res.status(404).json({ message: 'Banka bulunamadı.' });
        return;
    }
    yield bankRepo.remove(bank);
    res.json({ message: 'Banka silindi.' });
    return;
}));
exports.default = router;
