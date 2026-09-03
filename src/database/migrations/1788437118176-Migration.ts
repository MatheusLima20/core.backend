import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788437118176 implements MigrationInterface {
    name = 'Migration1788437118176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nutritious" ("uid" character varying(40) NOT NULL, "name" character varying(100) NOT NULL, "startWeek" integer NOT NULL, "endWeek" integer NOT NULL, "minimumCrudeProtein" numeric(5,2) NOT NULL, "maximumCrudeProtein" numeric(5,2) NOT NULL, "metabolizableEnergy" numeric(10,2), "crudeFiber" numeric(5,2), "calcium" numeric(5,2), "phosphorus" numeric(5,2), "sodium" numeric(5,2), "lysine" numeric(5,2), "methionine" numeric(5,2), "createdBy" character varying(40), "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03cea6d953790084684791b2dc4" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nutritious"`);
    }

}
