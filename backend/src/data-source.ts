import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from './entities/User';
import { Store } from './entities/Store';
import { Bank } from './entities/Bank';
import { Campaign } from './entities/Campaign';
import { Category } from './entities/Category';

// Vercel'de çalışırken /tmp klasörünü, yerelde çalışırken proje kök dizinini kullan
const databasePath = process.env.VERCEL
  ? path.join('/tmp', 'db.sqlite')
  : 'db.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true,
  logging: false,
  entities: [User, Store, Bank, Campaign, Category],
  migrations: [],
  subscribers: [],
}); 
 
 