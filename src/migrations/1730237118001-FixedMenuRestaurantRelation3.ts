import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedMenuRestaurantRelation31730237118001 implements MigrationInterface {
    name = 'FixedMenuRestaurantRelation31730237118001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_a9c5473205703022c7a53a410c2"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "restaurant_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ADD "restaurant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_a9c5473205703022c7a53a410c2" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
