import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788440503505 implements MigrationInterface {
    name = 'Migration1788440503505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weights" ("uid" character varying(40) NOT NULL, "platformUID" character varying(40), "flockUID" character varying(40) NOT NULL, "weighingDate" date NOT NULL, "averageWeight" numeric(10,2) NOT NULL, "sampleSize" integer, "notes" text, "createdBy" character varying(40), "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4e6de09cb6a52cbc17927e45672" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "weights"`);
    }

}
