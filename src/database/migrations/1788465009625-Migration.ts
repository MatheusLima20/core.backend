import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788465009625 implements MigrationInterface {
    name = 'Migration1788465009625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_categories_type_enum" AS ENUM('INCOME', 'EXPENSE')`);
        await queryRunner.query(`CREATE TABLE "transaction_categories" ("uid" character varying(40) NOT NULL, "platformUID" character varying(40), "name" character varying(100) NOT NULL, "type" "public"."transaction_categories_type_enum" NOT NULL, "color" character varying(20), "description" text, "createdBy" character varying(40), "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_35470bcdf2dc99f03ca237224ce" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('INCOME', 'EXPENSE')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_source_enum" AS ENUM('MANUAL', 'PURCHASE', 'EGG_SALE', 'BIRD_SALE', 'FEED_BATCH', 'LOSS', 'MEMBERSHIP')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("uid" character varying(40) NOT NULL, "platformUID" character varying(40) NOT NULL, "categoryUID" character varying(40) NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "description" character varying(255) NOT NULL, "source" "public"."transactions_source_enum", "sourceUID" character varying(40), "amount" numeric(14,2) NOT NULL, "occurredAt" TIMESTAMP NOT NULL, "notes" text, "createdBy" character varying(40) NOT NULL, "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3dcba0b0a4c2ed3442124475bf" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TYPE "public"."losses_reason_enum" AS ENUM('BROKEN_EGGS', 'FEED_WASTE', 'DEAD_ANIMAL', 'EXPIRED_PRODUCT', 'THEFT', 'DONATION', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "losses" ("uid" character varying(40) NOT NULL, "platformUID" character varying(40), "transactionUID" character varying(40), "productUID" character varying(40), "quantity" numeric(10,2) NOT NULL, "unitCost" numeric(12,2) NOT NULL, "totalCost" numeric(14,2) NOT NULL, "reason" "public"."losses_reason_enum" NOT NULL, "description" text, "occurredAt" TIMESTAMP NOT NULL, "createdBy" character varying(40), "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad6c828f08669f3bf8cb2f27f96" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "losses"`);
        await queryRunner.query(`DROP TYPE "public"."losses_reason_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "transaction_categories"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_categories_type_enum"`);
    }

}
