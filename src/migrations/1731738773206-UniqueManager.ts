import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueManager1731738773206 implements MigrationInterface {
    name = 'UniqueManager1731738773206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "manager" uuid`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "UQ_7f4e2c27b6ca70391e5091cd132" UNIQUE ("manager")`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_7f4e2c27b6ca70391e5091cd132" FOREIGN KEY ("manager") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_7f4e2c27b6ca70391e5091cd132"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "UQ_7f4e2c27b6ca70391e5091cd132"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "manager"`);
    }

}
