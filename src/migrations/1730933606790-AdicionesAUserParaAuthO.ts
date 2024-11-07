import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionesAUserParaAuthO1730933606790 implements MigrationInterface {
    name = 'AdicionesAUserParaAuthO1730933606790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_account_type_enum" AS ENUM('local', 'auth')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "account_type" "public"."users_account_type_enum" NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "sub" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sub"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "account_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_account_type_enum"`);
    }

}
