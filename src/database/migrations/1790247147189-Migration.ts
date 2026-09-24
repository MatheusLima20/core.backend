import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790247147189 implements MigrationInterface {
    name = 'Migration1790247147189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "contentUID" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "contentUID"`);
    }

}
