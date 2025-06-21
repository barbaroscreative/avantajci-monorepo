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
// @ts-nocheck
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Category_1 = require("../entities/Category");
const router = (0, express_1.Router)();
const repo = data_source_1.AppDataSource.getRepository(Category_1.Category);
// Listele
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield repo.find({ order: { name: 'ASC' } });
    res.json(categories);
}));
// Ekle
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Kategori adı zorunlu' });
    try {
        const category = repo.create({ name });
        yield repo.save(category);
        res.json(category);
    }
    catch (e) {
        res.status(400).json({ message: 'Kategori eklenemedi', error: e });
    }
}));
// Güncelle
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = yield repo.findOneBy({ id: Number(id) });
        if (!category)
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        category.name = name;
        yield repo.save(category);
        res.json(category);
    }
    catch (e) {
        res.status(400).json({ message: 'Kategori güncellenemedi', error: e });
    }
}));
// Sil
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield repo.findOneBy({ id: Number(id) });
        if (!category)
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        yield repo.remove(category);
        res.json({ message: 'Kategori silindi' });
    }
    catch (e) {
        res.status(400).json({ message: 'Kategori silinemedi', error: e });
    }
}));
exports.default = router;
