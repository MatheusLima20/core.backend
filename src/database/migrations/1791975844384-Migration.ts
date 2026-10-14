import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1791975844384 implements MigrationInterface {
    name = 'Migration1791975844384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weights" ADD "breedUID" character varying(40) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weights" DROP COLUMN "breedUID"`);
    }

}
