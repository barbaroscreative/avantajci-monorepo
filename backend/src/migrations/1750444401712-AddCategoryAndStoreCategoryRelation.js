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
exports.AddCategoryAndStoreCategoryRelation1750444401712 = void 0;
class AddCategoryAndStoreCategoryRelation1750444401712 {
    constructor() {
        this.name = 'AddCategoryAndStoreCategoryRelation1750444401712';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"))`);
            yield queryRunner.query(`CREATE TABLE "temporary_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
            yield queryRunner.query(`INSERT INTO "temporary_store"("id", "name", "createdAt", "logoUrl") SELECT "id", "name", "createdAt", "logoUrl" FROM "store"`);
            yield queryRunner.query(`DROP TABLE "store"`);
            yield queryRunner.query(`ALTER TABLE "temporary_store" RENAME TO "store"`);
            yield queryRunner.query(`CREATE TABLE "temporary_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"), CONSTRAINT "FK_403171c8a649b0b9d55d8ccb77c" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_store"("id", "name", "createdAt", "logoUrl", "categoryId") SELECT "id", "name", "createdAt", "logoUrl", "categoryId" FROM "store"`);
            yield queryRunner.query(`DROP TABLE "store"`);
            yield queryRunner.query(`ALTER TABLE "temporary_store" RENAME TO "store"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "store" RENAME TO "temporary_store"`);
            yield queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
            yield queryRunner.query(`INSERT INTO "store"("id", "name", "createdAt", "logoUrl", "categoryId") SELECT "id", "name", "createdAt", "logoUrl", "categoryId" FROM "temporary_store"`);
            yield queryRunner.query(`DROP TABLE "temporary_store"`);
            yield queryRunner.query(`ALTER TABLE "store" RENAME TO "temporary_store"`);
            yield queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
            yield queryRunner.query(`INSERT INTO "store"("id", "name", "createdAt", "logoUrl") SELECT "id", "name", "createdAt", "logoUrl" FROM "temporary_store"`);
            yield queryRunner.query(`DROP TABLE "temporary_store"`);
            yield queryRunner.query(`DROP TABLE "category"`);
        });
    }
}
exports.AddCategoryAndStoreCategoryRelation1750444401712 = AddCategoryAndStoreCategoryRelation1750444401712;
