import "reflect-metadata";
import { DataSource } from "typeorm";
const { User } = require("./entities/User");
const { Store } = require("./entities/Store");
const { Bank } = require("./entities/Bank");
const { Campaign } = require("./entities/Campaign");
const { Category } = require("./entities/Category");

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.VERCEL ? '/tmp/db.sqlite' : 'db.sqlite',
  synchronize: true, // Geliştirme için otomatik tablo oluşturma
  logging: false,
  entities: [User, Store, Bank, Campaign, Category],
  migrations: [],
  subscribers: [],
});
