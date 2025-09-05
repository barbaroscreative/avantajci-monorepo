import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Store } from "./entities/Store";
import { Bank } from "./entities/Bank";
import { Campaign } from "./entities/Campaign";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL || 'postgresql://localhost:5432/avantajci',
  synchronize: false, // Production'da synchronize kapalı
  logging: false, // Log'ları kapat
  entities: [User, Store, Bank, Campaign, Category],
  migrations: [], // Migration'ları kaldırdık
  subscribers: [],
  ssl: process.env.VERCEL ? { rejectUnauthorized: false } : false,
});
