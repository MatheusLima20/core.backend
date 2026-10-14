import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1791974027747 implements MigrationInterface {
    name = 'Migration1791974027747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weight_standards" RENAME COLUMN "breed" TO "breedUID"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weight_standards" RENAME COLUMN "breedUID" TO "breed"`);
    }

}
