import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790953145156 implements MigrationInterface {
    name = 'Migration1790953145156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "breeds" RENAME COLUMN "platformUID" TO "urlImage"`);
        await queryRunner.query(`ALTER TABLE "flocks" ADD "breedUID" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "breeds" DROP COLUMN "urlImage"`);
        await queryRunner.query(`ALTER TABLE "breeds" ADD "urlImage" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "breeds" DROP COLUMN "urlImage"`);
        await queryRunner.query(`ALTER TABLE "breeds" ADD "urlImage" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "flocks" DROP COLUMN "breedUID"`);
        await queryRunner.query(`ALTER TABLE "breeds" RENAME COLUMN "urlImage" TO "platformUID"`);
    }

}
