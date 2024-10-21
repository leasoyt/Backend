import { MigrationInterface, QueryRunner } from "typeorm";

export class Intento11729483003890 implements MigrationInterface {
    name = 'Intento11729483003890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f"`);
        await queryRunner.query(`ALTER TABLE "dish" RENAME COLUMN "menuId" TO "categoryId"`);
        await queryRunner.query(`CREATE TABLE "menu_category" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(20) NOT NULL, "menuId" uuid, CONSTRAINT "PK_246dfbfa0f3b0a4e953f7490544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dish" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "PK_da95cef71b617ac35dc5bcda243"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "id" uuid NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "menu_category" ADD CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_f101936095917dde2a9f0609516" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "menu_category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_f101936095917dde2a9f0609516"`);
        await queryRunner.query(`ALTER TABLE "menu_category" DROP CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "PK_da95cef71b617ac35dc5bcda243"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "dish" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "menu_category"`);
        await queryRunner.query(`ALTER TABLE "dish" RENAME COLUMN "categoryId" TO "menuId"`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_category" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
