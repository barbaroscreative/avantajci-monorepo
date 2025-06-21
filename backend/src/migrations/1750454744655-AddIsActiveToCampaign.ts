import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToCampaign1750454744655 implements MigrationInterface {
    name = 'AddIsActiveToCampaign1750454744655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "logoUrl" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "bank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "logoUrl" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "category" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean NOT NULL DEFAULT (1), "imageUrl" varchar, "rewardAmount" varchar, "rewardType" varchar, "bankId" integer)`);
        await queryRunner.query(`CREATE TABLE "campaign_stores_store" ("campaignId" integer NOT NULL, "storeId" integer NOT NULL, PRIMARY KEY ("campaignId", "storeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c5722d53363f1718cab281bd6" ON "campaign_stores_store" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_07118e0041a2e0727fbd84c2e2" ON "campaign_stores_store" ("storeId") `);
        await queryRunner.query(`CREATE TABLE "temporary_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "logoUrl" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"), CONSTRAINT "FK_403171c8a649b0b9d55d8ccb77c" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_store"("id", "name", "logoUrl", "createdAt", "categoryId") SELECT "id", "name", "logoUrl", "createdAt", "categoryId" FROM "store"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`ALTER TABLE "temporary_store" RENAME TO "store"`);
        await queryRunner.query(`CREATE TABLE "temporary_campaign" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "category" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean NOT NULL DEFAULT (1), "imageUrl" varchar, "rewardAmount" varchar, "rewardType" varchar, "bankId" integer, CONSTRAINT "FK_7abf78a2921f53a5a8fc061f6eb" FOREIGN KEY ("bankId") REFERENCES "bank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_campaign"("id", "title", "description", "startDate", "endDate", "category", "createdAt", "isActive", "imageUrl", "rewardAmount", "rewardType", "bankId") SELECT "id", "title", "description", "startDate", "endDate", "category", "createdAt", "isActive", "imageUrl", "rewardAmount", "rewardType", "bankId" FROM "campaign"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`ALTER TABLE "temporary_campaign" RENAME TO "campaign"`);
        await queryRunner.query(`DROP INDEX "IDX_2c5722d53363f1718cab281bd6"`);
        await queryRunner.query(`DROP INDEX "IDX_07118e0041a2e0727fbd84c2e2"`);
        await queryRunner.query(`CREATE TABLE "temporary_campaign_stores_store" ("campaignId" integer NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "FK_2c5722d53363f1718cab281bd65" FOREIGN KEY ("campaignId") REFERENCES "campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_07118e0041a2e0727fbd84c2e25" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("campaignId", "storeId"))`);
        await queryRunner.query(`INSERT INTO "temporary_campaign_stores_store"("campaignId", "storeId") SELECT "campaignId", "storeId" FROM "campaign_stores_store"`);
        await queryRunner.query(`DROP TABLE "campaign_stores_store"`);
        await queryRunner.query(`ALTER TABLE "temporary_campaign_stores_store" RENAME TO "campaign_stores_store"`);
        await queryRunner.query(`CREATE INDEX "IDX_2c5722d53363f1718cab281bd6" ON "campaign_stores_store" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_07118e0041a2e0727fbd84c2e2" ON "campaign_stores_store" ("storeId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_07118e0041a2e0727fbd84c2e2"`);
        await queryRunner.query(`DROP INDEX "IDX_2c5722d53363f1718cab281bd6"`);
        await queryRunner.query(`ALTER TABLE "campaign_stores_store" RENAME TO "temporary_campaign_stores_store"`);
        await queryRunner.query(`CREATE TABLE "campaign_stores_store" ("campaignId" integer NOT NULL, "storeId" integer NOT NULL, PRIMARY KEY ("campaignId", "storeId"))`);
        await queryRunner.query(`INSERT INTO "campaign_stores_store"("campaignId", "storeId") SELECT "campaignId", "storeId" FROM "temporary_campaign_stores_store"`);
        await queryRunner.query(`DROP TABLE "temporary_campaign_stores_store"`);
        await queryRunner.query(`CREATE INDEX "IDX_07118e0041a2e0727fbd84c2e2" ON "campaign_stores_store" ("storeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c5722d53363f1718cab281bd6" ON "campaign_stores_store" ("campaignId") `);
        await queryRunner.query(`ALTER TABLE "campaign" RENAME TO "temporary_campaign"`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "category" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean NOT NULL DEFAULT (1), "imageUrl" varchar, "rewardAmount" varchar, "rewardType" varchar, "bankId" integer)`);
        await queryRunner.query(`INSERT INTO "campaign"("id", "title", "description", "startDate", "endDate", "category", "createdAt", "isActive", "imageUrl", "rewardAmount", "rewardType", "bankId") SELECT "id", "title", "description", "startDate", "endDate", "category", "createdAt", "isActive", "imageUrl", "rewardAmount", "rewardType", "bankId" FROM "temporary_campaign"`);
        await queryRunner.query(`DROP TABLE "temporary_campaign"`);
        await queryRunner.query(`ALTER TABLE "store" RENAME TO "temporary_store"`);
        await queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "logoUrl" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "store"("id", "name", "logoUrl", "createdAt", "categoryId") SELECT "id", "name", "logoUrl", "createdAt", "categoryId" FROM "temporary_store"`);
        await queryRunner.query(`DROP TABLE "temporary_store"`);
        await queryRunner.query(`DROP INDEX "IDX_07118e0041a2e0727fbd84c2e2"`);
        await queryRunner.query(`DROP INDEX "IDX_2c5722d53363f1718cab281bd6"`);
        await queryRunner.query(`DROP TABLE "campaign_stores_store"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
