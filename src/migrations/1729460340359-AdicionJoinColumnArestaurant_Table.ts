import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionJoinColumnArestaurantTable1729460340359 implements MigrationInterface {
    name = 'AdicionJoinColumnArestaurantTable1729460340359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_tables" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "restaurant_tables" ADD CONSTRAINT "UQ_e28e61d6c0f49a4ba7f35820150" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "restaurant_tables" ADD CONSTRAINT "FK_e28e61d6c0f49a4ba7f35820150" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_tables" DROP CONSTRAINT "FK_e28e61d6c0f49a4ba7f35820150"`);
        await queryRunner.query(`ALTER TABLE "restaurant_tables" DROP CONSTRAINT "UQ_e28e61d6c0f49a4ba7f35820150"`);
        await queryRunner.query(`ALTER TABLE "restaurant_tables" DROP COLUMN "order_id"`);
    }

}
