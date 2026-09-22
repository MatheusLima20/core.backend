import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790079786463 implements MigrationInterface {
    name = 'Migration1790079786463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("uid" character varying NOT NULL, "platformUID" character varying NOT NULL, "categoryUID" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" numeric(10,2) NOT NULL, "barcode" character varying, "sku" character varying, "active" boolean NOT NULL DEFAULT true, "createdBy" character varying NOT NULL, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_6cab1bfba524743c3588c0ed0c5" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
