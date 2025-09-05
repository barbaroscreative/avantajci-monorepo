import "reflect-metadata";
import { DataSource } from "typeorm";
const { User } = require("./entities/User");
const { Store } = require("./entities/Store");
const { Bank } = require("./entities/Bank");
const { Campaign } = require("./entities/Campaign");
const { Category } = require("./entities/Category");

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL || 'postgresql://localhost:5432/avantajci',
  synchronize: true, // Geliştirme için otomatik tablo oluşturma
  logging: false,
  entities: [User, Store, Bank, Campaign, Category],
  migrations: [],
  subscribers: [],
  ssl: process.env.VERCEL ? { rejectUnauthorized: false } : false,
});
