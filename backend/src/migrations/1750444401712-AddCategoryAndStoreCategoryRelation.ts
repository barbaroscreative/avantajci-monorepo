import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryAndStoreCategoryRelation1750444401712 implements MigrationInterface {
    name = 'AddCategoryAndStoreCategoryRelation1750444401712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_store"("id", "name", "createdAt", "logoUrl") SELECT "id", "name", "createdAt", "logoUrl" FROM "store"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`ALTER TABLE "temporary_store" RENAME TO "store"`);
        await queryRunner.query(`CREATE TABLE "temporary_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"), CONSTRAINT "FK_403171c8a649b0b9d55d8ccb77c" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_store"("id", "name", "createdAt", "logoUrl", "categoryId") SELECT "id", "name", "createdAt", "logoUrl", "categoryId" FROM "store"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`ALTER TABLE "temporary_store" RENAME TO "store"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" RENAME TO "temporary_store"`);
        await queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, "categoryId" integer NOT NULL, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "store"("id", "name", "createdAt", "logoUrl", "categoryId") SELECT "id", "name", "createdAt", "logoUrl", "categoryId" FROM "temporary_store"`);
        await queryRunner.query(`DROP TABLE "temporary_store"`);
        await queryRunner.query(`ALTER TABLE "store" RENAME TO "temporary_store"`);
        await queryRunner.query(`CREATE TABLE "store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "logoUrl" varchar, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "store"("id", "name", "createdAt", "logoUrl") SELECT "id", "name", "createdAt", "logoUrl" FROM "temporary_store"`);
        await queryRunner.query(`DROP TABLE "temporary_store"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
