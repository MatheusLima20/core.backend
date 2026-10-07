import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1791375958792 implements MigrationInterface {
    name = 'Migration1791375958792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flock_breeds" ("uid" character varying(40) NOT NULL, "platformUID" character varying(40) NOT NULL, "flockUID" character varying(40) NOT NULL, "breedUID" character varying(40) NOT NULL, "quantity" integer NOT NULL, "createdBy" character varying(40) NOT NULL, "updatedBy" character varying(40), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3963d225905fdb96469f5fc5ff7" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "flocks" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "flocks" DROP COLUMN "breedUID"`);
        await queryRunner.query(`ALTER TABLE "egg_productions" ADD "breedUID" character varying(40) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "egg_productions" DROP COLUMN "breedUID"`);
        await queryRunner.query(`ALTER TABLE "flocks" ADD "breedUID" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "flocks" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "flock_breeds"`);
    }

}
