import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Store } from "./entities/Store";
import { Bank } from "./entities/Bank";
import { Campaign } from "./entities/Campaign";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  synchronize: true, // Geliştirme için otomatik tablo oluşturma
  logging: false,
  entities: [User, Store, Bank, Campaign, Category],
  migrations: [],
  subscribers: [],
});
