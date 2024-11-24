import { MigrationInterface, QueryRunner } from "typeorm";

export class WasHiddenRestaurant1732396175895 implements MigrationInterface {
    name = 'WasHiddenRestaurant1732396175895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "was_hidden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "was_hidden"`);
    }

}
