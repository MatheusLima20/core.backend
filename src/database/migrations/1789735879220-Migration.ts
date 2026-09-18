import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789735879220 implements MigrationInterface {
    name = 'Migration1789735879220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contents_type_enum" AS ENUM('IMAGE', 'VIDEO', 'FILE')`);
        await queryRunner.query(`CREATE TABLE "contents" ("uid" character varying NOT NULL, "platformUID" character varying NOT NULL, "type" "public"."contents_type_enum" NOT NULL, "url" character varying NOT NULL, "alt" character varying, "name" character varying NOT NULL, "mimeType" character varying, "size" integer, "createdBy" character varying NOT NULL, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_833a4ed18ad71173bbe91c41a3e" PRIMARY KEY ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contents"`);
        await queryRunner.query(`DROP TYPE "public"."contents_type_enum"`);
    }

}
