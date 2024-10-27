import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationAndRestaurantChanges1729989217197 implements MigrationInterface {
    name = 'ReservationAndRestaurantChanges1729989217197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "seats" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "restaurantId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "tableId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'default-image-url.jpg'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "restaurant_tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f290a56fcecb987c14c68414056" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f290a56fcecb987c14c68414056"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/v1729701300/RestO/c4pyhwljetkgahtkwkpi.webp'`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "tableId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "restaurant_tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "seats"`);
    }

}
