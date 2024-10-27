import { MigrationInterface, QueryRunner } from "typeorm";

export class DateToTimestamp1729995389933 implements MigrationInterface {
    name = 'DateToTimestamp1729995389933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "date" date NOT NULL`);
    }

}
