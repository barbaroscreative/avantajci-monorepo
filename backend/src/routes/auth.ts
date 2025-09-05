import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();

// Register (ilk admin kaydı için, sonra kapatılabilir)
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli.' });
    return;
  }
  try {
    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOneBy({ username });
    if (existing) {
      res.status(400).json({ message: 'Bu kullanıcı adı zaten var.' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({ username, password: hashed });
    await userRepo.save(user);
    res.status(201).json({ message: 'Kullanıcı oluşturuldu.' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı oluşturulamadı', error });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli.' });
    return;
  }
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ username });
    if (!user) {
      res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Giriş yapılamadı', error });
  }
});

export default router;
