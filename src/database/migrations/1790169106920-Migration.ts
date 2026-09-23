import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790169106920 implements MigrationInterface {
    name = 'Migration1790169106920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stocks" ("uid" character varying NOT NULL, "platformUID" character varying NOT NULL, "productUID" character varying NOT NULL, "quantity" numeric(12,3) NOT NULL DEFAULT '0', "minimumStock" numeric(12,3) NOT NULL DEFAULT '0', "createdBy" character varying NOT NULL, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_014b241a98be9a7aeca0a5f7de4" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stocks"`);
    }

}
