import { MigrationInterface, QueryRunner } from "typeorm";

export class RestaurantCambios1729648419713 implements MigrationInterface {
    name = 'RestaurantCambios1729648419713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" ADD "isOpen" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" ALTER COLUMN "openingTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" ALTER COLUMN "closingTime" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" ALTER COLUMN "closingTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" ALTER COLUMN "openingTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_schedule" DROP COLUMN "isOpen"`);
    }

}
