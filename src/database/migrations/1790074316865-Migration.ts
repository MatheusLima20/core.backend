import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790074316865 implements MigrationInterface {
    name = 'Migration1790074316865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("uid" character varying NOT NULL, "platformUID" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdBy" character varying NOT NULL, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_45f6115e26018e225b04e325473" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
