import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1792176653427 implements MigrationInterface {
    name = 'Migration1792176653427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feeds" ADD "flockUID" character varying(40) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feeds" DROP COLUMN "flockUID"`);
    }

}
