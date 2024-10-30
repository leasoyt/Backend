import { MigrationInterface, QueryRunner } from "typeorm";

export class RestaurantJoinColumn1730231339425 implements MigrationInterface {
    name = 'RestaurantJoinColumn1730231339425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_085156de3c3a44eba017a6a0846"`);
        await queryRunner.query(`ALTER TABLE "menu" RENAME COLUMN "restaurantId" TO "restaurant_id"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_a9c5473205703022c7a53a410c2" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_a9c5473205703022c7a53a410c2"`);
        await queryRunner.query(`ALTER TABLE "menu" RENAME COLUMN "restaurant_id" TO "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_085156de3c3a44eba017a6a0846" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
