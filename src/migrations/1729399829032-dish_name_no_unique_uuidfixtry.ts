import { MigrationInterface, QueryRunner } from 'typeorm';

export class DishNameNoUniqueUuidfixtry1729399829032
  implements MigrationInterface
{
  name = 'DishNameNoUniqueUuidfixtry1729399829032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`,
    );
    await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD "user" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "PK_da95cef71b617ac35dc5bcda243"`,
    );
    await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" DROP CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`,
    );
    // await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "name" SET DEFAULT 'menu'`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881"`,
    );
    // await queryRunner.query(`ALTER TABLE "dish" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "dish" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" DROP CONSTRAINT "UQ_07626606a3b574903a702fd6ae6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_760073be5484aacee86b9e7172a"`,
    );
    // await queryRunner.query(`ALTER TABLE "order_detail" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "order_detail" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`,
    );
    // await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`,
    );
    // await queryRunner.query(`ALTER TABLE "restaurant_tables" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ALTER COLUMN "id" DROP DEFAULT`,
    );
    // await queryRunner.query(`ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_46bd4688044889498eae892e959"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" DROP CONSTRAINT "FK_e90558dc8b4609f3e7c75b28158"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" DROP CONSTRAINT "FK_b740cfb364ff3b216127f825427"`,
    );
    // await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "restaurant" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "FK_7a0df7028ab735331618a439bb2"`,
    );
    // await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "restaurant_tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ADD CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ADD CONSTRAINT "FK_e90558dc8b4609f3e7c75b28158" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ADD CONSTRAINT "FK_b740cfb364ff3b216127f825427" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "FK_7a0df7028ab735331618a439bb2" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_46bd4688044889498eae892e959" FOREIGN KEY ("waiterRestaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_760073be5484aacee86b9e7172a" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_760073be5484aacee86b9e7172a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_46bd4688044889498eae892e959"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "FK_7a0df7028ab735331618a439bb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" DROP CONSTRAINT "FK_b740cfb364ff3b216127f825427"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" DROP CONSTRAINT "FK_e90558dc8b4609f3e7c75b28158"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" DROP CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "FK_7a0df7028ab735331618a439bb2" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ADD CONSTRAINT "FK_b740cfb364ff3b216127f825427" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ADD CONSTRAINT "FK_e90558dc8b4609f3e7c75b28158" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_46bd4688044889498eae892e959" FOREIGN KEY ("waiterRestaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "restaurant_tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_760073be5484aacee86b9e7172a" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ADD CONSTRAINT "UQ_07626606a3b574903a702fd6ae6" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ADD CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "PK_da95cef71b617ac35dc5bcda243"`,
    );
    await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "user"`);
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_tables" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_schedule" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }
}
