import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1730684211274 implements MigrationInterface {
    name = 'NewMigration1730684211274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "userId" TO "user"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('processing', 'cancelled', 'completed', 'paid')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'processing'`);
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "name" SET DEFAULT 'menu'`);
        await queryRunner.query(`ALTER TABLE "menu_category" DROP CONSTRAINT "UQ_5a2d8aba371281e6eee1826ab62"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "UQ_07626606a3b574903a702fd6ae6"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'default-image-url.jpg'`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "UQ_07626606a3b574903a702fd6ae6" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "menu_category" ADD CONSTRAINT "UQ_5a2d8aba371281e6eee1826ab62" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "user" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
