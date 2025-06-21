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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Register (ilk admin kaydı için, sonra kapatılabilir)
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli.' });
        return;
    }
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const existing = yield userRepo.findOneBy({ username });
    if (existing) {
        res.status(400).json({ message: 'Bu kullanıcı adı zaten var.' });
        return;
    }
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const user = userRepo.create({ username, password: hashed });
    yield userRepo.save(user);
    res.status(201).json({ message: 'Kullanıcı oluşturuldu.' });
    return;
}));
// Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli.' });
        return;
    }
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = yield userRepo.findOneBy({ username });
    if (!user) {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
        return;
    }
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    if (!valid) {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token });
    return;
}));
exports.default = router;
