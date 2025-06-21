"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Store_1 = require("./entities/Store");
const Bank_1 = require("./entities/Bank");
const Campaign_1 = require("./entities/Campaign");
const Category_1 = require("./entities/Category");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true, // Geliştirme için otomatik tablo oluşturma
    logging: false,
    entities: [User_1.User, Store_1.Store, Bank_1.Bank, Campaign_1.Campaign, Category_1.Category],
    migrations: [],
    subscribers: [],
});
