import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790858236397 implements MigrationInterface {
    name = 'Migration1790858236397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" RENAME COLUMN "productUID" TO "itemUID"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD "status" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "stocks" RENAME COLUMN "itemUID" TO "productUID"`);
    }

}
